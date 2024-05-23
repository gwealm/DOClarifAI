"""
  document type routes.
"""
from fastapi import APIRouter

from common.crud.postgres import document_types as crud_document_types 
from common.crud.postgres import schemas as crud_schemas
from common.models.document_types import DocumentType
from common.models.schemas import Schema

from common.deps import (
    PostgresDB,
    CurrentUser
)

router = APIRouter(prefix="/document_type")

@router.get("/")
def get_document_types(db:PostgresDB) -> list[DocumentType]:
  """
  Get document types.
  """
  return crud_document_types.get_document_types(session=db)


@router.get("/{document_type_id}")
def get_document_type_schemas(db:PostgresDB, current_user: CurrentUser, document_type_id: int) -> list[Schema]:
  """
  Get schemas of document type.
  """
  x = crud_schemas.get_schemas_by_document_type(session=db, user_id=current_user.id, document_type_id=document_type_id)
  print(x)
  return x