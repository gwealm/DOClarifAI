"""
  File routes.
"""
from typing import Any
from fastapi import APIRouter

from common.crud.postgres import files as crud_files
from common.models.workflows import (File, FileCreate)
from common.deps import PostgresDB

from app.deps import PathWorkflow

router = APIRouter(prefix="/{workflow_id}/file")


@router.post("/")
def create_file(*, session: PostgresDB, file_in: FileCreate,
                workflow: PathWorkflow) -> Any:
  """
  Create a new workflow.
  """

  file_in = FileCreate.model_validate(file_in)
  file = crud_files.create_file(session=session, file=file_in)
  return file


@router.get("/")
def read_user_me(workflow: PathWorkflow) -> list[File]:
  #TODO: Paginate Results
  """
  Get current workflow's files.
  """
  return workflow.files


@router.delete("/{file_id}")
def delete_user(session: PostgresDB, workflow: PathWorkflow,
                file_id: int) -> Any:
  """
  Delete the file with the provided ID.
  """
  # TODO: What to do with deleted files
  # Maybe make the user consume the processed files before deleting workflow
  # Or on delete return all files
  #TODO: Delete all  data related with the user (workflows, documents, etc)
  session.delete(workflow)
  session.commit()
  return {"message": "Workflow deleted successfully"}
