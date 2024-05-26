"""
This module contains the FastAPI route for uploading a 
file to be processed by the document extraction service.
"""

from fastapi import APIRouter, HTTPException, UploadFile, BackgroundTasks
from app.models.document_status import DocumentStatus
from app.crud import documents as crud_documents
from common.crud.postgres import workflows as crud_workflows
from common.crud.postgres import files as crud_files
from common.deps import CurrentUser, PostgresDB, DoxClient
from common.models.workflows import Workflow
from common.models.files import FileCreate, FileProcesingStatus
from common.models.document_types import DocumentType
from common.models.templates import Template
from common.models.schemas import Schema

router = APIRouter()




@router.post("/{workflow_id}", status_code=202)
async def upload_file(dox_client: DoxClient, current_user: CurrentUser,
                      postgres_db: PostgresDB,file: UploadFile,
                      background_tasks: BackgroundTasks, workflow_id: int) -> DocumentStatus:
  """
    This asynchronous endpoint lets the client
      submit a pdf document for processing. 
  """

  workflow: Workflow = crud_workflows.get_workflow_by_id(
      session=postgres_db, workflow_id=workflow_id)

  if not workflow:
    raise HTTPException(status_code=404, detail="Workflow doesn't exist")
  if workflow.user != current_user:
    raise HTTPException(status_code=401,
                        detail="Current user is not the owner of this flow")

  file_metadata = crud_files.create_file(session=postgres_db,
                                         file=FileCreate(
                                             workflow_id=workflow_id,
                                             name=file.filename))

  client_id:str = "default"
  template:Template = workflow.template
  document_type:DocumentType = template.document_type
  schema:Schema = template.schema

  def document_extracted_callback_partial(workflow_id: int, file_metadata_id: int):

    def store_structured_info(document_extraction: dict):
      return crud_documents.update_document_extraction_metadata(document_extraction,
                                                       workflow_id,
                                                       file_metadata_id)

    return store_structured_info

  document_extracted_callback = document_extracted_callback_partial(
      workflow.id, file_metadata.id
  )

  extracted_info = await dox_client.upload_document(
      file, client_id, document_type.name,
      background_tasks.add_task,document_extracted_callback,
      template.template_id_dox,schema.schema_id_dox
  )

  match extracted_info["status"]:
    case "PENDING":
      file_metadata.process_status = FileProcesingStatus.PROCESSING
    case _:
      file_metadata.process_status = FileProcesingStatus.FAILED

  postgres_db.commit()
  return extracted_info
