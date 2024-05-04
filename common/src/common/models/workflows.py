"""
  This file contains the Pydantic models for the Workflow entity.
"""
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, Relationship
from .templates import Template
from typing import TYPE_CHECKING
if TYPE_CHECKING:
  from .users import User
  from .files import File


class WorkflowIn(BaseModel):
  name: str | None
  description: str | None
  template_id: int


class WorkflowCreate(WorkflowIn):
  user_id: int


class Workflow(SQLModel, table=True):
  """
    The ORM model for the Workflow entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str
  description: str
  email: str | None
  files: list["File"] = Relationship(back_populates="workflow")

  template_id: int = Field(default=None, foreign_key="template.id")
  template: "Template" = Relationship()

  user_id: int = Field(default=None, foreign_key="user.id")
  user: "User" = Relationship(back_populates="workflows")
