"""
This module contains the FastAPI route for uploading a 
file to be processed by the document extraction service.
"""

from fastapi import APIRouter, HTTPException, UploadFile, BackgroundTasks
from app.models.document_status import DocumentStatus
from app.api.deps import MongoDB, DoxClient
from app.crud import documents as crud_documents
from common.crud.postgres import workflows as crud_workflows
from common.crud.postgres import files as crud_files
from common.deps import CurrentUser, PostgresDB
from pathlib import Path
from common.models.workflows import Workflow
from common.models.files import FileCreate, FileProcesingStatus

router = APIRouter()


def store_unprocessed_file(workflow_id: int, file: UploadFile):
  workflow_dir = Path(f"files/{workflow_id}")
  workflow_dir.mkdir(parents=True, exist_ok=True)

  file_path = workflow_dir / file.filename

  try:
    with open(file_path, "wb") as f:
      content = file.file.read()  # Read the file content
      f.write(content)
  except Exception as e:
    print(f"An error occurred while saving the file: {e}")
    return ""

  return str(file_path)


@router.post("/{workflow_id}", status_code=202)
async def upload_file(dox_client: DoxClient, current_user: CurrentUser,
                      mongo_db: MongoDB, postgres_db: PostgresDB,
                      file: UploadFile, background_tasks: BackgroundTasks,
                      workflow_id: int) -> DocumentStatus:
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

  file_path = store_unprocessed_file(workflow_id, file)
  file_metadata = crud_files.create_file(session=postgres_db,
                                         file=FileCreate(
                                             workflow_id=workflow_id,
                                             name=file.filename,
                                             unprocessed_path=file_path))

  # Default values TODO: obtain them from db according to flow
  DEFAULT_CLIENT_ID = "default"
  DEFAULT_DOCUMENT_TYPE = "invoice"
  DEFAULT_HEADER_FIELDS = [
      "documentNumber", "taxId", "purchaseOrderNumber", "shippingAmount",
      "netAmount", "senderAddress", "senderName", "grossAmount", "currencyCode",
      "receiverContact", "documentDate", "taxAmount", "taxRate", "receiverName",
      "receiverAddress"
  ]
  DEFAULT_LINE_ITEM_FIELDS = [
      "description", "netAmount", "quantity", "unitPrice", "materialNumber"
  ]

  # Upload the file and initiate document extraction

  def document_extracted_callback_partial(mongo_db: MongoDB, workflow: Workflow,
                                          file_metadata_id: int,
                                          file_path: str):

    def store_structured_info(document_extraction: dict):
      return crud_documents.upload_document_extraction(mongo_db,
                                                       document_extraction,
                                                       workflow,
                                                       file_metadata_id,
                                                       file_path)

    return store_structured_info

  document_extracted_callback = document_extracted_callback_partial(
      mongo_db, workflow, file_metadata.id, file_metadata.unprocessed_path)


  extracted_info = await dox_client.upload_document(
      file, DEFAULT_CLIENT_ID, DEFAULT_DOCUMENT_TYPE, background_tasks.add_task,
      document_extracted_callback, DEFAULT_HEADER_FIELDS,
      DEFAULT_LINE_ITEM_FIELDS)

  match extracted_info["status"]:
    case "PENDING":
      file_metadata.process_status = FileProcesingStatus.PROCESSING
    case _:
      file_metadata.process_status = FileProcesingStatus.FAILED

  postgres_db.commit()
  return extracted_info
