"""
  This file is used to initialize the database connection.
"""
from sqlmodel import Session, create_engine, SQLModel

from common.config import settings
from common.models.users import User
from common.models.templates import Template
from common.models.files import File
from common.models.workflows import Workflow
from common.models.schemas import Schema
from common.models.document_types import DocumentType
import common.crud.postgres.document_types as crud_document_types
from common.document_information_extraction_client.dox_api_client import DoxApiClient
from common.config import settings
import asyncio

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=True)
SQLModel.metadata.create_all(engine)


dox_client:DoxApiClient = DoxApiClient(settings.SAP_BASE_URL,
                                   settings.SAP_CLIENT_ID,
                                   settings.SAP_CLIENT_SECRET,
                                   settings.SAP_UAA_URL)
with Session(engine) as session:
  asyncio.run(crud_document_types.add_document_types(session=session,dox_client=dox_client))

