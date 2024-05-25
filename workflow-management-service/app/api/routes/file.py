"""
  File routes.
"""
from typing import Any
from fastapi import APIRouter, HTTPException

from common.crud.postgres import files as crud_files
from common.models.files import (File, FileCreate, FileProcesingStatus)
from common.models.workflows import Workflow
from common.models.templates import Template
from common.models.schemas import Schema
from common.deps import (
    CurrentUser,
    PostgresDB,
    DoxClient
)

from app.deps import PathWorkflow

router = APIRouter(prefix="/{workflow_id}/file")

def do_nothing_callback(extracted_document):
  pass

@router.post("/")
def create_file(*, session: PostgresDB, file_in: FileCreate,
                workflow: PathWorkflow) -> Any:
  """
  Create a new file.
  """

  file_in = FileCreate.model_validate(file_in)
  file = crud_files.create_file(session=session, file=file_in)
  return file


@router.get("/")
def get_workflow_files(workflow: PathWorkflow) -> list[File]:
  #TODO: Paginate Results
  """
  Get current workflow's files.
  """
  return workflow.files


@router.delete("/{file_id}")
def delete_file(session: PostgresDB, workflow: PathWorkflow,
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


@router.get("/{file_id}/original-file")
async def get_pdf_file( session: PostgresDB, current_user: CurrentUser, dox_client:DoxClient, workflow_id: int, file_id: int):
  """
  Get the original uploaded document
  """
  workflow:Workflow = session.get(Workflow, workflow_id)
  file:File = crud_files.get_file_by_id(session=session,file_id=file_id)

  if not file:
    raise HTTPException(status_code=404, detail="File not found")
  elif not workflow:
    raise HTTPException(status_code=404, detail="Workflow not found")
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  elif file.workflow != workflow:
    raise HTTPException(status_code=403,
                        detail="File not associated with workflow")

  return await dox_client.get_original_uploaded_document(file.dox_id)

@router.get("/{file_id}/results")
async def get_file_results( session: PostgresDB, current_user: CurrentUser, dox_client:DoxClient, workflow_id: int, file_id: int):
  """
  Get the results for the file
  """
  workflow:Workflow = session.get(Workflow, workflow_id)
  file:File = crud_files.get_file_by_id(session=session,file_id=file_id)

  if not workflow:
    raise HTTPException(status_code=404, detail="Workflow not found")
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  elif file.workflow != workflow:
    raise HTTPException(status_code=403,
                        detail="File not associated w.ith workflow")
  elif file.process_status == FileProcesingStatus.QUEUED or file.process_status == FileProcesingStatus.PROCESSING:
    raise HTTPException(status_code=400,
                        detail="File is still being processed")


  extraction_results:dict = await dox_client.get_extraction_for_document(file.dox_id,do_nothing_callback)
  extraction:dict = extraction_results["extraction"]

  template:Template = workflow.template
  schema:Schema = template.schema
  dox_schema = await dox_client.get_schema(schema.schema_id_dox)

  return {
    "extraction":extraction,
    "schema":dox_schema
  }



@router.post("/{file_id}/ground-truth")
async def save_ground_truth( session: PostgresDB, current_user: CurrentUser, dox_client:DoxClient, workflow_id: int, file_id: int,payload:dict):
  workflow:Workflow = session.get(Workflow, workflow_id)
  file:File = crud_files.get_file_by_id(session=session,file_id=file_id)

  if not workflow:
    raise HTTPException(status_code=404, detail="Workflow not found")
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  elif file.workflow != workflow:
    raise HTTPException(status_code=403,
                        detail="File not associated w.ith workflow")
  elif file.process_status == FileProcesingStatus.QUEUED or file.process_status == FileProcesingStatus.PROCESSING:
    raise HTTPException(status_code=400,
                        detail="File is still being processed")

  await dox_client.save_ground_truth(file.dox_id,payload)

  document_extraction:dict = await dox_client.get_extraction_for_document(file.dox_id,do_nothing_callback)

  crud_files.update_document_extraction_metadata(
    document_extraction,
    workflow_id,
    file_id
  )
