from typing import Any

from pydantic import BaseModel, Field, field_validator

ALLOWED_CURRENCIES = {"USD", "PYG", "ARS", "BRL", "COP", "MXN"}
ALLOWED_STRATEGIES = {"snowball", "avalanche", "consolidation", "ai"}
ALLOWED_LANGS = {"es", "en"}


class DebtInput(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    saldo: float = Field(..., gt=0)
    tasa: float = Field(..., ge=0, le=500)
    cuota_min: float = Field(..., ge=0)

    @field_validator("nombre")
    @classmethod
    def validate_nombre(cls, value: str) -> str:
        clean_value = value.strip()
        if not clean_value:
            raise ValueError("El nombre de la deuda es obligatorio.")
        return clean_value


class GeneratePlanRequest(BaseModel):
    nombre: str = Field(default="", max_length=80)
    extra_mensual: float = Field(..., ge=0)
    moneda: str = Field(default="USD")
    estrategia: str = Field(default="ai")
    lang: str = Field(default="es")
    deudas: list[DebtInput] = Field(..., min_length=1, max_length=8)

    @field_validator("nombre")
    @classmethod
    def validate_nombre(cls, value: str) -> str:
        return value.strip()

    @field_validator("moneda")
    @classmethod
    def validate_moneda(cls, value: str) -> str:
        if value not in ALLOWED_CURRENCIES:
            raise ValueError("Moneda inválida.")
        return value

    @field_validator("estrategia")
    @classmethod
    def validate_estrategia(cls, value: str) -> str:
        if value not in ALLOWED_STRATEGIES:
            raise ValueError("Estrategia inválida.")
        return value

    @field_validator("lang")
    @classmethod
    def validate_lang(cls, value: str) -> str:
        if value not in ALLOWED_LANGS:
            raise ValueError("Idioma inválido.")
        return value


class PlanResponse(BaseModel):
    pin: str
    plan: dict[str, Any]
    created_at: str
    expires_at: str
