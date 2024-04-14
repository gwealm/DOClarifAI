from sqlalchemy import create_engine
from app.core.config import settings
from sqlmodel import Session, create_engine

engine = create_engine(str(settings.POSTGRES_DATABASE_URI))


def init_db(session: Session) -> None:
  pass
