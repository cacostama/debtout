import json
import logging
import os
from datetime import datetime, timedelta
from typing import Any

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlmodel import Session, select

from claude_service import ClaudeServiceError, generate_debt_plan
from database import create_db, get_session
from models import Plan
from pin_service import (
    clear_failed_pin_attempts,
    generate_unique_pin,
    get_client_ip,
    is_ip_blocked,
    register_failed_pin_attempt,
    validate_pin_format,
)
from schemas import GeneratePlanRequest, PlanResponse

load_dotenv()
create_db()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("debtout.api")

MAX_REQUEST_SIZE_BYTES = 10 * 1024
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
}

app = FastAPI(title="DebtOut API", version="1.0.0")

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip() and origin.strip() != "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def enforce_request_size_limit(request: Request, call_next: Any) -> Response:
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_REQUEST_SIZE_BYTES:
                return JSONResponse(status_code=413, content={"detail": "Request entity too large"})
        except ValueError:
            logger.warning("Invalid content-length header from %s", get_client_ip(request))
            return JSONResponse(status_code=413, content={"detail": "Request entity too large"})

    if request.method in {"POST", "PUT", "PATCH"}:
        body = await request.body()
        if len(body) > MAX_REQUEST_SIZE_BYTES:
            return JSONResponse(status_code=413, content={"detail": "Request entity too large"})

    return await call_next(request)


@app.middleware("http")
async def add_security_headers(request: Request, call_next: Any) -> Response:
    response = await call_next(request)
    for header_name, header_value in SECURITY_HEADERS.items():
        response.headers[header_name] = header_value
    return response


@app.get("/api/health")
async def health(request: Request) -> dict[str, str]:
    return {"status": "ok", "service": "DebtOut API"}


@app.post("/api/plan/generate", response_model=PlanResponse)
@limiter.limit("5/minute")
async def generate_plan(
    request: Request,
    payload: GeneratePlanRequest,
    session: Session = Depends(get_session),
) -> PlanResponse:
    debts_payload = [debt.model_dump() for debt in payload.deudas]

    try:
        result = await generate_debt_plan(
            nombre=payload.nombre,
            extra_mensual=payload.extra_mensual,
            moneda=payload.moneda,
            estrategia=payload.estrategia,
            lang=payload.lang,
            deudas=debts_payload,
        )
    except ClaudeServiceError as exc:
        logger.warning("Claude service error from %s: %s", get_client_ip(request), exc)
        raise HTTPException(status_code=502, detail="No pudimos generar tu plan ahora mismo.") from exc
    except Exception:
        logger.exception("Unexpected error generating plan")
        raise HTTPException(status_code=500, detail="Internal server error")

    try:
        pin = generate_unique_pin(session)
        expiry_days = int(os.getenv("PIN_EXPIRY_DAYS", "30"))
        expires_at = datetime.utcnow() + timedelta(days=expiry_days)

        plan = Plan(
            pin=pin,
            lang=payload.lang,
            moneda=payload.moneda,
            extra_mensual=payload.extra_mensual,
            estrategia=payload.estrategia,
            debts_json=json.dumps(debts_payload, ensure_ascii=False),
            result_json=json.dumps(result, ensure_ascii=False),
            expires_at=expires_at,
        )
        session.add(plan)
        session.commit()
        session.refresh(plan)
    except Exception:
        logger.exception("Unexpected database error generating plan")
        raise HTTPException(status_code=500, detail="Internal server error")

    return PlanResponse(
        pin=plan.pin,
        plan=result,
        created_at=plan.created_at.isoformat(),
        expires_at=plan.expires_at.isoformat(),
    )


@app.get("/api/plan/{pin}", response_model=PlanResponse)
@limiter.limit("20/minute")
async def get_plan(request: Request, pin: str, session: Session = Depends(get_session)) -> PlanResponse:
    client_ip = get_client_ip(request)
    if is_ip_blocked(client_ip):
        raise HTTPException(status_code=429, detail="Too many attempts, try again later")

    normalized_pin = pin.strip()
    if not validate_pin_format(normalized_pin):
        if register_failed_pin_attempt(client_ip):
            raise HTTPException(status_code=429, detail="Too many attempts, try again later")
        raise HTTPException(status_code=400, detail="Formato de PIN inválido. Usá el formato XXX-XXX.")

    try:
        plan = session.exec(select(Plan).where(Plan.pin == normalized_pin)).first()
    except Exception:
        logger.exception("Unexpected database error recovering plan")
        raise HTTPException(status_code=500, detail="Internal server error")

    if plan is None:
        if register_failed_pin_attempt(client_ip):
            raise HTTPException(status_code=429, detail="Too many attempts, try again later")
        raise HTTPException(status_code=404, detail="No encontramos un plan con ese PIN.")

    if datetime.utcnow() > plan.expires_at:
        if register_failed_pin_attempt(client_ip):
            raise HTTPException(status_code=429, detail="Too many attempts, try again later")
        raise HTTPException(status_code=410, detail="Este plan expiró. Generá uno nuevo para continuar.")

    try:
        parsed_plan: dict[str, Any] = json.loads(plan.result_json)
    except json.JSONDecodeError:
        logger.exception("Stored plan JSON is invalid for pin %s", normalized_pin)
        raise HTTPException(status_code=500, detail="Internal server error")

    clear_failed_pin_attempts(client_ip)

    return PlanResponse(
        pin=plan.pin,
        plan=parsed_plan,
        created_at=plan.created_at.isoformat(),
        expires_at=plan.expires_at.isoformat(),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("Validation error: %s", exc.errors())
    return JSONResponse(status_code=422, content={"detail": "Hay datos inválidos en la solicitud."})


@app.exception_handler(Exception)
async def generic_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled server error", exc_info=exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
