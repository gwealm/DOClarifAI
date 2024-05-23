"""
  This module contains the CRUD operations for the Schema ORM.
"""
from sqlmodel import Session, select
from common.models.schemas import Schema, SchemaCreate
from common.models.users import User
from common.document_information_extraction_client.dox_api_client import DoxApiClient
import common.crud.postgres.document_types as crud_document_types


def create_schema(*, session: Session, schema: SchemaCreate) -> Schema:
  """
  Create a new schema.
  Args:
    session: PostgresDB session
    schema: New schema information
  Returns:
    schema: The created schema
  """
  db_obj = Schema.model_validate(schema)
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)

  if schema.user_id:
    statement = select(User).where(User.id == schema.user_id)
    user = session.exec(statement).one()
    if not user:
      return None
    db_obj.user = user
    session.commit()
    session.refresh(db_obj)
  return db_obj

async def add_default_schemas(*, session:Session, user:User, dox_client:DoxApiClient):
  all_schemas = (await dox_client.get_all_schemas())["schemas"]
  default_schemas = [schema for schema in all_schemas if schema["predefined"]]
  for default_schema in default_schemas:
    schema_create = SchemaCreate(name=default_schema["name"],
                                 document_type_id=crud_document_types.get_document_type_by_name(session=session,name=default_schema["documentType"]).id,
                                 description=default_schema["schemaDescription"],
                                 user_id=user.id,
                                 schema_id_dox=default_schema["id"],
                                 predefined=True)
    create_schema(session=session,schema=schema_create)  


def get_schemas_by_document_type(*, session:Session, user_id:int, document_type_id:int):
  return session.query(Schema).filter(Schema.user_id==user_id).filter(Schema.document_type_id==document_type_id).all()


def get_schema_by_id(*, session:Session, schema_id:int):
  statement = select(Schema).where(Schema.id == schema_id)
  schema = session.exec(statement).first()
  return schema