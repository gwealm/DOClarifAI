"""
  This file contains the Pydantic models for the Template entity.
"""
from sqlmodel import Field, SQLModel


class Template(SQLModel, table=True):
  """
    The ORM model for the Template entity.
  """
  id: int | None = Field(default=None, index=True)
  name: str | None
  description: str | None
