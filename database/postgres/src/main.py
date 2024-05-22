"""
  This file is used to initialize the database connection.
"""
from sqlmodel import create_engine, SQLModel

from common.config import settings
from common.models.users import User
from common.models.templates import Template
from common.models.files import File
from common.models.workflows import Workflow
from common.models.schemas import Schema
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=True)
SQLModel.metadata.create_all(engine)
