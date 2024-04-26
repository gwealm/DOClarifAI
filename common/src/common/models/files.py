"""
  This file contains the Pydantic models for the File entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from common.models.workflows import Workflow
from enum import Enum


class FileProcesingStatus(Enum):
  QUEUED = 0
  PROCESSING = 1
  FAILED = 2
  SUCCESS = 3


class File(SQLModel, table=True):
  """
    The ORM model for the Files entity.
  """
  id: int | None = Field(default=None, index=True)
  name: str | None
  raw: str
  process_status: FileProcesingStatus
  processed_link: str | None

  workflow_id: int = Field(default=None, foreign_key="workflow.id")
  workflow: "Workflow" = Relationship(back_populates="files")
