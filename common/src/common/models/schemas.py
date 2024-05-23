"""
  This file contains the Pydantic models for the Template entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from pydantic import BaseModel
from typing import TYPE_CHECKING, Optional, List, Dict, Any
if TYPE_CHECKING:
  from .users import User
  from .templates import Template

class SchemaBase(BaseModel):
  name: str
  schemaDescription: str

class SchemaIn(SchemaBase):
  clientId: str
  documentType: str
  documentTypeDescription: str

class SchemaCreate(SchemaBase):
  user_id: int
  schema_id_dox: str


class FieldExtractor(BaseModel):
  fieldName: str

class CustomField(BaseModel):
  name: str
  description: str
  label: str
  categoryName: str
  defaultExtractor: Optional[FieldExtractor] = {}
  setupType: str
  setupTypeVersion: str
  setup: Dict[str, Any]
  formattingType: str
  formatting: Dict[str, Any]
  formattingTypeVersion: str

class SchemaFields(BaseModel):
  headerFields: List[CustomField]
  lineItemFields: List[CustomField]


class Schema(SQLModel, table=True):
  """
    The ORM model for the Schema entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str
  schemaDescription: str
  schema_id_dox:str
  user_id: int = Field(foreign_key="user.id")
  user: Optional["User"] = Relationship(back_populates="schemas")
  templates: list["Template"] = Relationship(back_populates="schema")
