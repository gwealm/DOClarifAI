"""
  This file is used to initialize the database connection.
"""
from common.config import settings
from sqlmodel import create_engine

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
