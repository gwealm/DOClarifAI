"""
  This module contains the CRUD operations for the Schema ORM.
"""
from sqlmodel import Session, select
from common.models.schemas import Schema, SchemaCreate
from common.models.users import User


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
