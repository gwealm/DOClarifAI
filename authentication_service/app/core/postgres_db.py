"""
  This file is used to initialize the database connection.
"""
from sqlalchemy import create_engine
from app.core.config import settings
from sqlmodel import Session, create_engine

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db(session: Session) -> None:
  pass
