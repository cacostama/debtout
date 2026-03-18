import random
import string

from sqlmodel import Session, select

from models import Plan


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
