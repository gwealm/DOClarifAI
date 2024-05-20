"""
  This file contains the Pydantic models for the Template entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import JSON, Column
from pydantic import BaseModel
from typing import TYPE_CHECKING, Optional
if TYPE_CHECKING:
  from .users import User


class TemplateIn(BaseModel):
  name: str
  description: str
  schema: dict

class TemplateCreate(TemplateIn):
  user_id: int | None


class Template(SQLModel, table=True):
  """
    The ORM model for the Template entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str
  description: str
  schema: dict = Field(sa_column=Column(JSON))
  user_id: int | None = Field(default=None, foreign_key="user.id")
  user: Optional["User"] = Relationship(back_populates="templates")
