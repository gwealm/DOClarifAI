from sqlalchemy import create_engine
from app.core.config import settings
from sqlmodel import Session, create_engine, SQLModel


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def init_db(session: Session) -> None:
    SQLModel.metadata.create_all(engine)
