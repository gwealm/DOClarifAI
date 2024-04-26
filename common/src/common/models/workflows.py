"""
  This file contains the Pydantic models for the Workflow entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from common.models.users import User
from common.models.files import File
from common.models.templates import Template


class Workflow(SQLModel, table=True):
  """
    The ORM model for the Workflow entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str
  files: list[File] = Relationship(back_populates="workflow")

  template_id: int = Field(default=None, foreign_key="template.id")
  template: Template = Relationship()

  user_id: int = Field(default=None, foreign_key="user.id")
  user: User = Relationship(back_populates="workflows")
