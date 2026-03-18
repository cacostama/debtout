from datetime import datetime
import uuid

from sqlmodel import Field, SQLModel


class Plan(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    pin: str = Field(index=True, unique=True)
    lang: str = Field(default="es", max_length=2)
    moneda: str = Field(default="USD", max_length=3)
    extra_mensual: float
    estrategia: str
    debts_json: str
    result_json: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
