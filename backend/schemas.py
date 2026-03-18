import re
from typing import Any

from pydantic import BaseModel, Field, field_validator

ALLOWED_CURRENCIES = {"USD", "EUR", "GBP", "PYG", "ARS", "BRL", "COP", "MXN"}
ALLOWED_STRATEGIES = {"snowball", "avalanche", "consolidation", "ai"}
ALLOWED_LANGS = {"es", "en"}
FORBIDDEN_PATTERNS = ("<script", "javascript:")
TAG_RE = re.compile(r"<[^>]+>")
NAME_RE = re.compile(r"^[\w\s\-'\.]+$", re.UNICODE)
MAX_AMOUNT = 999_999_999


def contains_forbidden_content(value: str) -> bool:
    lowered = value.casefold()
    return any(pattern in lowered for pattern in FORBIDDEN_PATTERNS)


def sanitize_text(value: str) -> str:
    without_tags = TAG_RE.sub("", value)
    return " ".join(without_tags.strip().split())


def validate_safe_text(value: str, *, field_name: str, max_length: int) -> str:
    raw_value = value or ""
    if contains_forbidden_content(raw_value):
        raise ValueError(f"El campo {field_name} contiene contenido no permitido.")

    clean_value = sanitize_text(raw_value)
    if len(clean_value) > max_length:
        raise ValueError(f"El campo {field_name} supera el largo máximo permitido.")

    return clean_value


class DebtInput(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    saldo: float = Field(..., gt=0, le=MAX_AMOUNT)
    tasa: float = Field(..., ge=0, le=500)
    cuota_min: float = Field(..., ge=0, le=MAX_AMOUNT)

    @field_validator("nombre")
    @classmethod
    def validate_nombre(cls, value: str) -> str:
        clean_value = validate_safe_text(value, field_name="nombre de deuda", max_length=100)
        if not clean_value:
            raise ValueError("El nombre de la deuda es obligatorio.")
        return clean_value


class GeneratePlanRequest(BaseModel):
    nombre: str = Field(default="", max_length=50)
    extra_mensual: float = Field(..., ge=0, le=MAX_AMOUNT)
    moneda: str = Field(default="USD")
    estrategia: str = Field(default="ai")
    lang: str = Field(default="es")
    deudas: list[DebtInput] = Field(..., min_length=1, max_length=8)

    @field_validator("nombre")
    @classmethod
    def validate_nombre(cls, value: str) -> str:
        clean_value = validate_safe_text(value, field_name="nombre", max_length=50)
        if clean_value and not NAME_RE.fullmatch(clean_value):
            raise ValueError("El nombre solo puede contener letras, números y espacios.")
        return clean_value

    @field_validator("moneda")
    @classmethod
    def validate_moneda(cls, value: str) -> str:
        if contains_forbidden_content(value):
            raise ValueError("Moneda inválida.")
        if value not in ALLOWED_CURRENCIES:
            raise ValueError("Moneda inválida.")
        return value

    @field_validator("estrategia")
    @classmethod
    def validate_estrategia(cls, value: str) -> str:
        if contains_forbidden_content(value):
            raise ValueError("Estrategia inválida.")
        if value not in ALLOWED_STRATEGIES:
            raise ValueError("Estrategia inválida.")
        return value

    @field_validator("lang")
    @classmethod
    def validate_lang(cls, value: str) -> str:
        if contains_forbidden_content(value):
            raise ValueError("Idioma inválido.")
        if value not in ALLOWED_LANGS:
            raise ValueError("Idioma inválido.")
        return value


class PlanResponse(BaseModel):
    pin: str
    plan: dict[str, Any]
    created_at: str
    expires_at: str
