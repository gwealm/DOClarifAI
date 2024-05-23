"""
  This file contains the Pydantic models for the Document Types entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from pydantic import BaseModel
from typing import TYPE_CHECKING
if TYPE_CHECKING:
  from .schemas import Schema
  from .templates import Template


class DocumentTypeCreate(BaseModel):
  name: str


class DocumentType(SQLModel, table=True):
  """
    The ORM model for the Document Type entity.
  """
  __tablename__ = "document_type"
  id: int | None = Field(default=None, primary_key=True)
  name: str
  templates: list["Template"] = Relationship(back_populates="document_type")
  schemas: list["Schema"] = Relationship(back_populates="document_type")

