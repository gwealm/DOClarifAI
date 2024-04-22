from fastapi import APIRouter
from app.api.deps import MongoDB
from common.deps import CurrentUser
from fastapi import HTTPException, Path
from fastapi.responses import FileResponse
from app.crud import documents as crud_documents
import os
from fastapi import BackgroundTasks


router = APIRouter()


@router.get("/{document_id}/xlsx")
async def export_document_excel(db:MongoDB, background_tasks: BackgroundTasks,user:CurrentUser,document_id: str = Path(..., description="The ID of the document to download"))-> FileResponse:
  """
    This endpoint lets the client download a document in xlsx format.
  """
  document_xlsx_file_path: str = crud_documents.get_document_by_id_xlsx(db,user,document_id)
  if document_xlsx_file_path is None:
    raise HTTPException(status_code=404, detail="Document not found")

  background_tasks.add_task(os.remove,document_xlsx_file_path)
  return FileResponse(document_xlsx_file_path, filename="output.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

@router.get("/{workflow_id}")
async def list_documents(db:MongoDB,user:CurrentUser,workflow_id: int = Path(..., description="The ID of the workflow for which to list documents")):
  """
    This endpoint returns a list of all documents in the database.
  """
  return crud_documents.get_documents_by_workflow(db,user,workflow_id)
