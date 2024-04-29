"""
  This file contains the Pydantic models for the Template entity.
"""
from sqlmodel import Field, SQLModel, Relationship

from typing import TYPE_CHECKING
if TYPE_CHECKING:
  from .users import User


class TemplateCreate(SQLModel):
  name: str
  description: str
  user_id: int | None


class Template(TemplateCreate, table=True):
  """
    The ORM model for the Template entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  user_id: int | None = Field(default=None, foreign_key="user.id")
  user: "User" = Relationship(back_populates="templates")
