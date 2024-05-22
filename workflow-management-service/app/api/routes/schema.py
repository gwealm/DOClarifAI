"""
  Schema routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import schemas as crud_schemas
from common.models.schemas import (Schema, SchemaCreate, SchemaIn)
from common.deps import PostgresDB, CurrentUser, DoxClient


router = APIRouter(prefix="/schema")


@router.post("/")
def create_schema(
    *,
    session: PostgresDB,
    schema_in: SchemaIn,
    current_user: CurrentUser,
) -> Any:
  """
  Create a new scema.
  """
  schema_create = SchemaCreate.model_construct(**schema_in.model_dump(),
                                                   user_id=current_user.id
                                                   #TODO:  schema_id_dox=...
                                              )
  schema_create = Schema.model_validate(schema_create)
  schema = crud_schemas.create_schema(session=session,
                                            schema=schema_create)
  return schema


@router.get("/")
async def get_schemas(current_user: CurrentUser) -> Any:
  """
  Get user schemas.
  """
  return current_user.schemas



@router.delete("/{schema_id}")
def delete_schema(session: PostgresDB, current_user: CurrentUser,
                    schema_id: int) -> Any:
  """
  Delete the schema with the provided ID.
  """
  schema = session.get(Schema, schema_id)
  if not schema:
    raise HTTPException(status_code=404, detail="schema not found")
  elif schema.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")

  session.delete(schema)
  session.commit()
  return {"message": "schema deleted successfully"}

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