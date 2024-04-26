"""
  This file contains the Pydantic models for the Workflows entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum


class FileProcesingStatus(Enum):
  QUEUED = 0
  PROCESSING = 1
  FAILED = 2
  SUCCESS = 3


class Files(SQLModel, table=True):
  """
    The ORM model for the Workflow entity.
  """
  id: int | None = Field(default=None, index=True)
  name: str | None
  raw: str
  process_status: FileProcesingStatus
  processed_link: str | None
  workflow: "Workflows" = Relationship(back_populates="files")


class Templates(SQLModel, table=True):
  """
    The ORM model for the Template entity.
  """
  id: int | None = Field(default=None, index=True)
  name: str | None
  description: str | None


class Workflows(SQLModel, table=True):
  """
    The ORM model for the Workflow entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str
  template: Templates = Relationship()
  files: list[Files] = Relationship(back_populates="workflow")
