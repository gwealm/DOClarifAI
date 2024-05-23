"""
  This file contains the Pydantic models for the Template entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from pydantic import BaseModel
from typing import TYPE_CHECKING, Optional
if TYPE_CHECKING:
  from .users import User
  from .schemas import Schema
  from .document_types import DocumentType


class TemplateIn(BaseModel):
  name: str
  description: str
  schema_id: int
  document_type_id: int


class TemplateCreate(TemplateIn):
  user_id: int
  template_id_dox:str


class Template(SQLModel, table=True):
  """
    The ORM model for the Template entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str
  description: str
  template_id_dox:str
  
  schema_id: int = Field(foreign_key="schema.id")
  schema: "Schema" = Relationship(back_populates="templates")
  
  user_id: int = Field(foreign_key="user.id")
  user: "User" = Relationship(back_populates="templates")
  
  document_type_id: int = Field(foreign_key = "document_type.id")
  document_type: "DocumentType" = Relationship(back_populates="templates")
  
