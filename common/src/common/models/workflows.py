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
  name: str
  description: str
  confidence_interval:float = Field(default=0.7)
  template_id: int
  email: str | None



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
  confidence_interval:float
  
  files: list["File"] = Relationship(back_populates="workflow")
  
  template_id: int = Field(foreign_key="template.id")
  template: "Template" = Relationship(back_populates="workflows")

  user_id: int = Field(foreign_key="user.id")
  user: "User" = Relationship(back_populates="workflows")
