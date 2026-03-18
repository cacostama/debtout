import json
import os
from datetime import datetime, timedelta
from typing import Any

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlmodel import Session, select

from claude_service import ClaudeServiceError, generate_debt_plan
from database import create_db, get_session
from models import Plan
from pin_service import generate_unique_pin, validate_pin_format
from schemas import GeneratePlanRequest, PlanResponse

load_dotenv()
create_db()

app = FastAPI(title="DebtOut API", version="1.0.0")

CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "DebtOut API"}


@app.post("/api/plan/generate", response_model=PlanResponse)
async def generate_plan(
    request: GeneratePlanRequest,
    session: Session = Depends(get_session),
) -> PlanResponse:
    debts_payload = [debt.model_dump() for debt in request.deudas]

    try:
        result = await generate_debt_plan(
            nombre=request.nombre,
            extra_mensual=request.extra_mensual,
            moneda=request.moneda,
            estrategia=request.estrategia,
            lang=request.lang,
            deudas=debts_payload,
        )
    except ClaudeServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    pin = generate_unique_pin(session)
    expiry_days = int(os.getenv("PIN_EXPIRY_DAYS", "30"))
    expires_at = datetime.utcnow() + timedelta(days=expiry_days)

    plan = Plan(
        pin=pin,
        lang=request.lang,
        moneda=request.moneda,
        extra_mensual=request.extra_mensual,
        estrategia=request.estrategia,
        debts_json=json.dumps(debts_payload),
        result_json=json.dumps(result, ensure_ascii=False),
        expires_at=expires_at,
    )
    session.add(plan)
    session.commit()
    session.refresh(plan)

    return PlanResponse(
        pin=plan.pin,
        plan=result,
        created_at=plan.created_at.isoformat(),
        expires_at=plan.expires_at.isoformat(),
    )


@app.get("/api/plan/{pin}", response_model=PlanResponse)
async def get_plan(pin: str, session: Session = Depends(get_session)) -> PlanResponse:
    normalized_pin = pin.strip()
    if not validate_pin_format(normalized_pin):
        raise HTTPException(status_code=400, detail="Formato de PIN inválido. Usá el formato XXX-XXX.")

    plan = session.exec(select(Plan).where(Plan.pin == normalized_pin)).first()
    if plan is None:
        raise HTTPException(status_code=404, detail="No encontramos un plan con ese PIN.")

    if datetime.utcnow() > plan.expires_at:
        raise HTTPException(status_code=410, detail="Este plan expiró. Generá uno nuevo para continuar.")

    try:
        parsed_plan: dict[str, Any] = json.loads(plan.result_json)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="El plan guardado no se pudo leer.") from exc

    return PlanResponse(
        pin=plan.pin,
        plan=parsed_plan,
        created_at=plan.created_at.isoformat(),
        expires_at=plan.expires_at.isoformat(),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Any, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"detail": "Hay datos inválidos en la solicitud.", "errors": exc.errors()},
    )
