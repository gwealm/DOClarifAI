"""
  This file contains the Pydantic models for the File entity.
"""
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum
from pydantic import BaseModel
from typing import TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
  from .workflows import Workflow


class FileProcesingStatus(Enum):
  QUEUED = 0
  PROCESSING = 1
  FAILED = 2
  SUCCESS = 3


class FileCreate(BaseModel):
  workflow_id: int = Field(default=None, foreign_key="workflow.id")
  name: str | None

class File(SQLModel, table=True):
  """
    The ORM model for the Files entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  name: str | None
  process_status: FileProcesingStatus | None = Field(default=FileProcesingStatus.QUEUED)
  dox_id: str | None = Field(default=None)
  uploaded_at: datetime = Field(default_factory=datetime.now)
  workflow_id: int = Field(default=None, foreign_key="workflow.id")
  workflow: "Workflow" = Relationship(back_populates="files")
