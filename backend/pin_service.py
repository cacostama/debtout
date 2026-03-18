import random
import string
from datetime import datetime, timedelta

from fastapi import Request
from sqlmodel import Session, select

from models import Plan

FAILED_PIN_ATTEMPTS: dict[str, dict[str, datetime | int | None]] = {}
MAX_FAILED_ATTEMPTS = 10
BLOCK_WINDOW = timedelta(minutes=15)


def generate_unique_pin(session: Session) -> str:
    while True:
        digits = "".join(random.choices(string.digits, k=6))
        pin = f"{digits[:3]}-{digits[3:]}"
        existing = session.exec(select(Plan).where(Plan.pin == pin)).first()
        if existing is None:
            return pin


def validate_pin_format(pin: str) -> bool:
    parts = pin.split("-")
    return (
        len(parts) == 2
        and len(parts[0]) == 3
        and len(parts[1]) == 3
        and parts[0].isdigit()
        and parts[1].isdigit()
    )


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def is_ip_blocked(ip_address: str) -> bool:
    entry = FAILED_PIN_ATTEMPTS.get(ip_address)
    if not entry:
        return False

    blocked_until = entry.get("blocked_until")
    if isinstance(blocked_until, datetime):
        if datetime.utcnow() < blocked_until:
            return True
        FAILED_PIN_ATTEMPTS.pop(ip_address, None)

    return False


def register_failed_pin_attempt(ip_address: str) -> bool:
    now = datetime.utcnow()
    entry = FAILED_PIN_ATTEMPTS.setdefault(ip_address, {"count": 0, "blocked_until": None})
    entry["count"] = int(entry.get("count", 0)) + 1

    if int(entry["count"]) >= MAX_FAILED_ATTEMPTS:
        entry["blocked_until"] = now + BLOCK_WINDOW
        return True

    return False


def clear_failed_pin_attempts(ip_address: str) -> None:
    FAILED_PIN_ATTEMPTS.pop(ip_address, None)
