"""
  This file is used to initialize the database connection.
"""
from sqlmodel import create_engine, SQLModel

from common.config import settings
from common.models.users import User
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=True)
SQLModel.metadata.create_all(engine)
