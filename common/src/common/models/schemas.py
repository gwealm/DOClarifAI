"""
  This file contains the Pydantic models for the Template entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from pydantic import BaseModel
from typing import TYPE_CHECKING, Optional
if TYPE_CHECKING:
  from .users import User
  from .templates import Template
  from .document_types import DocumentType

class SchemaBase(BaseModel):
  name: str
  description: str
  document_type_id: int

class SchemaIn(SchemaBase):
  schema_definition:dict

class SchemaCreate(SchemaBase):
  user_id: int
  schema_id_dox: str


class Schema(SQLModel, table=True):
  """
    The ORM model for the Schema entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str
  description: str
  schema_id_dox:str
  
  user_id: int = Field(foreign_key="user.id")
  user: Optional["User"] = Relationship(back_populates="schemas")
  
  document_type_id: int = Field(foreign_key = "document_type.id")
  document_type: "DocumentType" = Relationship(back_populates="schemas")
  
  templates: list["Template"] = Relationship(back_populates="schema")
