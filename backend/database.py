import os
from collections.abc import Generator

from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./debtout.db")

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)


def create_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
