"""
  document type routes.
"""
from fastapi import APIRouter

from common.crud.postgres import document_types as crud_document_types
from common.crud.postgres import schemas as crud_schemas
from common.crud.postgres import templates as crud_templates
from common.models.document_types import DocumentType
from common.models.schemas import Schema
from common.models.templates import Template
from common.deps import (
    PostgresDB,
    CurrentUser
)

router = APIRouter(prefix="/document_type")

@router.get("/")
def get_document_types(session:PostgresDB) -> list[DocumentType]:
  """
  Get document types.
  """
  return crud_document_types.get_document_types(session=session)


@router.get("/{document_type_id}/schema/active")
def get_document_type_active_schemas(session:PostgresDB, current_user: CurrentUser, document_type_id: int) -> list[Schema]:
  """
  Get active schemas of document type.
  """
  return crud_schemas.get_active_schemas_by_document_type(
    session=session,
    user_id=current_user.id,
    document_type_id=document_type_id
  )


@router.get("/{document_type_id}/templates/active")
def get_document_type_active_schemas(session:PostgresDB, current_user: CurrentUser, document_type_id: int) -> list[Template]:
  """
  Get active templates of document type.
  """
  return crud_templates.get_active_templates_by_document_type(
    session=session,
    user_id=current_user.id,
    document_type_id=document_type_id
  )
