"""
  This module contains the routes for the exporter service.
"""
from fastapi import APIRouter
from fastapi import BackgroundTasks
from fastapi import HTTPException, Path
from fastapi.responses import FileResponse
from common.deps import CurrentUser,PostgresDB
from app.api.deps import MongoDB
from app.crud import documents as crud_documents
from common.crud.postgres import files as crud_files
from common.crud.postgres import workflows as crud_workflows
from common.models.workflows import Workflow
from common.models.files import File

import os

router = APIRouter()


@router.get("/{document_id}/xlsx")
async def export_document_excel(
    db: MongoDB,
    background_tasks: BackgroundTasks,
    user: CurrentUser,
    document_id: str = Path(...,
                            description="The ID of the document to download")
) -> FileResponse:
  """
        This endpoint lets the client download a document in xlsx format.
      """
  document_xlsx_file_path: str = crud_documents.get_document_by_id_xlsx(
      db, user, document_id)
  if document_xlsx_file_path is None:
    raise HTTPException(status_code=404, detail="Document not found")

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
