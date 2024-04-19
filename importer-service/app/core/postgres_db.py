"""
This file is responsible for creating the database connection and initializing the database.
"""

from sqlalchemy import create_engine
from app.core.config import settings
from sqlmodel import Session

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db(session: Session) -> None:
  pass
