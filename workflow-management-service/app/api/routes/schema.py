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
  
  already_existing_schema = crud_schemas.get_user_schema_by_name(session=session,
                                                                user_id=current_user.id,
                                                                schema_name=schema_in.name)
  if already_existing_schema is not None:
    raise HTTPException(status_code=400, detail="Schema with provided name already exists")
  
  document_type = crud_document_types.get_document_type_by_id(session=session, document_type_id=schema_in.document_type_id)
  if not document_type:
    raise HTTPException(status_code=404, detail="Document type not found")
  if " " in schema_in.name:
    raise HTTPException(status_code=422, detail="Schema name must not contain spaces")
  payload = {
      "clientId": "default",
      "name": f"{current_user.username}_{schema_in.name}",
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
async def get_schema(*,schema_id: int, current_user: CurrentUser, dox_client: DoxClient, session: PostgresDB) -> Any:
    """
    Get the schema with the provided ID.
    """
    schema = crud_schemas.get_schema_by_id(session=session,schema_id=schema_id)
    if not schema:
      raise HTTPException(status_code=404, detail="Schema not found")
    elif schema.user != current_user:
      raise HTTPException(status_code=403,
                          detail="The user doesn't have enough privileges") 
    
    schema = await dox_client.get_schema(schema.schema_id_dox)
    return schema

@router.post("/{schema_id}/fields")
async def post_fields_on_schema_version(*, schema_id: int, current_user: CurrentUser, fields: SchemaFields, dox_client: DoxClient, session: PostgresDB) -> Any:
    """
    Post fields on the schema version.
    """
    schema = crud_schemas.get_schema_by_id(session=session,schema_id=schema_id)
    if not schema:
      raise HTTPException(status_code=404, detail="Schema not found")
    elif schema.user != current_user:
      raise HTTPException(status_code=403,
                          detail="The user doesn't have enough privileges")  
    elif schema.predefined:
      raise HTTPException(status_code=400,
                          detail="Can't alter predefined schema fields")
    elif schema.active:
      raise HTTPException(status_code=400,
                      detail="Can't alter active schema fields")
    
    response = await dox_client.post_fields_on_schema_version(schema.schema_id_dox, fields.dict())
    return response

@router.post("/{schema_id}/activate")
async def activate_schema_version(*, schema_id: int, current_user: CurrentUser, dox_client: DoxClient, session: PostgresDB) -> Any:
    """
    Activate the schema version.
    """
    schema = crud_schemas.get_schema_by_id(session=session,schema_id=schema_id)
    if not schema:
      raise HTTPException(status_code=404, detail="Schema not found")
    elif schema.user != current_user:
      raise HTTPException(status_code=403,
                          detail="The user doesn't have enough privileges")  
    elif schema.active:
      raise HTTPException(status_code=400,
                      detail="The schema is already active")  

    await dox_client.activate_schema_version(schema.schema_id_dox)
  
    schema.active = True
    session.commit()
    return {"message": "Schema activated succesfully"}
  
@router.post("/{schema_id}/deactivate")
async def deactivate_schema_version(*, schema_id: int, current_user: CurrentUser, dox_client: DoxClient, session: PostgresDB) -> Any:
    """
    Deactivate the schema version.
    """
    schema = crud_schemas.get_schema_by_id(session=session,schema_id=schema_id)
    if not schema:
      raise HTTPException(status_code=404, detail="Schema not found.")
    elif schema.user != current_user:
      raise HTTPException(status_code=403,
                          detail="The user doesn't have enough privileges.")  
    elif schema.predefined:
      raise HTTPException(status_code=400,
                          detail="Can't deactivate predefined schemas")
    elif not schema.active:
      raise HTTPException(status_code=400,
                      detail="The schema is already inactive.")  
    elif len(schema.templates)>0:
      raise HTTPException(status_code=400,
                      detail="The schema is being used by at least one template.")  

    await dox_client.deactivate_schema_version(schema.schema_id_dox)

    schema.active = False
    session.commit()
    return {"message": "Schema deactivated succesfully"}