"""
  Schema routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import schemas as crud_schemas
from common.crud.postgres import document_types as crud_document_types
from common.models.schemas import (Schema, SchemaCreate, SchemaIn, SchemaFields)
from common.deps import PostgresDB, CurrentUser, DoxClient


router = APIRouter(prefix="/schema")


@router.post("/")
async def create_schema(
    *,
    session: PostgresDB,
    schema_in: SchemaIn,
    current_user: CurrentUser,
    dox_client: DoxClient
) -> Any:
  """
  Create a new scema.
  """
  document_type = crud_document_types.get_document_type_by_id(session=session, document_type_id=schema_in.document_type_id)
  if not document_type:
    raise HTTPException(status_code=404, detail="document type not found")
  if " " in schema_in.name:
    raise HTTPException(status_code=422, detail="schema name must not contain spaces")
  payload = {
      "clientId": "default",
      "name": schema_in.name,
      "schemaDescription": schema_in.description,
      "documentType": document_type.name,
      "documentTypeDescription": ""
  }
  # Create the schema in the Dox API
  try:
      dox_response = await dox_client.create_schema(payload)
  except Exception as e:
      raise HTTPException(status_code=500, detail="Failed to create schema in the Dox API") from e

  schema_id_dox = dox_response.get("id")

  schema_create = SchemaCreate.model_construct(
    **schema_in.model_dump(),
    schema_id_dox=schema_id_dox,
    user_id=current_user.id
  )
  
  schema = crud_schemas.create_schema(session=session, schema=schema_create)
  return schema



@router.get("/")
async def get_schemas(current_user: CurrentUser) -> Any:
  """
  Get user schemas.
  """
  return current_user.schemas



@router.get("/{schema_id}")
async def get_schema(*,schema_id: int, current_user: CurrentUser, dox_client: DoxClient, db: PostgresDB) -> Any:
    """
    Get the schema with the provided ID.
    """
    # Assuming current_user.schemas is a relationship property
    schema = db.query(Schema).filter(Schema.id == schema_id, Schema.user_id == current_user.id).first()
    
    if not schema:
        raise HTTPException(status_code=404, detail="schema not found")
    
    schema = await dox_client.get_schema(schema.schema_id_dox)
    return schema

@router.post("/{schema_id}/fields")
async def post_fields_on_schema_version(*, schema_id: int, fields: SchemaFields, dox_client: DoxClient, db: PostgresDB) -> Any:
    """
    Post fields on the schema version.
    """
    schema = db.query(Schema).filter(Schema.id == schema_id).first()
    if not schema:
        raise HTTPException(status_code=404, detail="schema not found")
    
    payload = {
        "headerFields": fields.headerFields,
        "lineItemFields": fields.lineItemFields
    }
    response = await dox_client.post_fields_on_schema_version(schema.schema_id_dox, payload)
    return response