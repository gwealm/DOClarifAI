"""
  This file contains the Pydantic models for the Template entity.
"""
from sqlmodel import Field, SQLModel


class TemplateCreate(SQLModel):
  name: str
  description: str


class Template(TemplateCreate, table=True):
  """
    The ORM model for the Template entity.
  """
  id: int | None = Field(default=None,primary_key=True)
