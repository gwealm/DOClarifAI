"""
  This module contains the routes for the exporter service.
"""
from fastapi import APIRouter
from fastapi import BackgroundTasks
from fastapi import HTTPException, Path
from fastapi.responses import FileResponse
from common.deps import CurrentUser,PostgresDB,DoxClient
from common.crud.postgres import files as crud_files
from common.crud.postgres import workflows as crud_workflows
from common.models.workflows import Workflow
from common.models.files import File

import os

router = APIRouter()


@router.get("/{file_id}/xlsx")
async def export_extracted_results(
    session: PostgresDB,
    background_tasks: BackgroundTasks,
    dox_client:DoxClient,
    current_user: CurrentUser,
    file_id: int
) -> FileResponse:
  """
        This endpoint lets the client download the extracted results for a file in xlsx format.
  """
  
  file:File = crud_files.get_file_by_id(session=session,file_id=file_id)
  workflow:Workflow = file.workflow
  
  if not file:
    raise HTTPException(status_code=404, detail="File not found")  
  elif workflow.user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")
  
  document_xlsx_file_path: str = crud_files.get_extracted_results_by_id_xlsx(
      session=session, file_id=file_id, dox_client=dox_client)
  if document_xlsx_file_path is None:
    raise HTTPException(status_code=500, detail="Error exporting the extracted results")

  background_tasks.add_task(os.remove, document_xlsx_file_path)
  return FileResponse(
      document_xlsx_file_path,
      filename="output.xlsx",
      media_type=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@router.get("/{workflow_id}")
async def list_documents(
    postgres_db:PostgresDB,
    current_user: CurrentUser,
    workflow_id: int = Path(
        ..., description=
        "The ID of the workflow for which to list documents")) -> list[File]:
  """
        This endpoint returns a list of all documents in the database.
  """
  workflow:Workflow = crud_workflows.get_workflow_by_id(
    session=postgres_db,workflow_id=workflow_id
  )

  if not workflow:
    raise HTTPException(status_code=404,detail="Workflow doesn't exist")
  if workflow.user!=current_user:
    raise HTTPException(status_code=401,
                        detail="Current user is not the owner of this flow")

  return crud_files.get_files_by_workflow_id(
    session=postgres_db,workflow_id=workflow_id
    )
