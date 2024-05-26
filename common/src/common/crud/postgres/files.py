"""
  This module contains the CRUD operations for the File ORM.
"""
from sqlmodel import Session, select
from common.models.files import File, FileCreate
from common.crud.postgres import files as crud_files
from common.document_information_extraction_client.dox_api_client import DoxApiClient
from common.models.files import File, FileProcesingStatus
from common.crud.postgres import workflows as crud_workflows
from common.postgres import engine

import pandas as pd
import tempfile

def format_document(data: dict):
  """
    This function formats the document data into a DataFrame, for invoice data
    extraction.
    """
  header_data = {field["name"]:
                 field["value"] for field in data["headerFields"]}

  # Extract line items
  line_items_data = []
  for line_item in data["lineItems"]:
    line_item_data = {item["name"]: item["value"] for item in line_item}
    line_items_data.append(line_item_data)

  header_df = pd.DataFrame(header_data, index=[0])

  line_items_df = pd.DataFrame(line_items_data)

  result_df = pd.concat([header_df, line_items_df], axis=1)

  return result_df


def create_file(*, session: Session, file: FileCreate) -> File:
  """
  Create a new file.
  Args:
    session: PostgresDB session
    file: New file information
  Returns:
    File: The created file
  """
  db_obj = File.model_validate(file)
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)
  return db_obj


def get_files_by_workflow_id(*, session: Session,
                             workflow_id: int) -> list[File]:
  """
    Get files by workflow id.
    Args:
      session: PostgresDB session
      workflow id: The workflow id
    Returns:
      list[File]: The Files related to the workflow id
  """
  statement = select(File).where(File.workflow_id == workflow_id).order_by(File.uploaded_at.desc())
  # TODO: Paginate Results
  files = session.exec(statement).all()
  return files

def get_file_by_id(*, session: Session,
                             file_id: int) -> File:
  statement = select(File).where(File.id == file_id)
  file = session.exec(statement).first()
  return file


async def get_extracted_results_by_id(*, session:Session,file_id:int, dox_client: DoxApiClient):
  file:File = crud_files.get_file_by_id(session=session,file_id=file_id)    
  if file is None or file.dox_id is None:
    return None
  def do_nothing_callback(extracted_document):
    pass
  return await dox_client.get_extraction_for_document(file.dox_id,do_nothing_callback)

async def get_extracted_results_by_id_xlsx(*,session:Session, file_id: str, dox_client: DoxApiClient) -> str:
  document:dict = await crud_files.get_extracted_results_by_id(session=session, file_id=file_id, dox_client=dox_client)
  if not document:
    return None
  document_data = document["extraction"]
  formatted_document = format_document(document_data)
  _, path = tempfile.mkstemp(suffix=".xlsx")
  formatted_document.to_excel(path, index=False)
  return path


def check_confidence_level(document_extraction: dict,
                           min_confidence: float) -> list[str]:
  """
    Checks if the confidence level of all fields in
      the document extraction is above the minimum required.
    Returns a list of fields with confidence levels below the minimum.
    """
  irregular_fields = []

  header_data = {
      field["name"]: field["confidence"]
      for field in document_extraction["headerFields"]
  }

  for field, confidence in header_data.items():
    if confidence < min_confidence:
      irregular_fields.append(field)

  line_items_data = []

  for line_item in document_extraction["lineItems"]:
    line_item_data = {item["name"]: item["confidence"] for item in line_item}
    line_items_data.append(line_item_data)

  for line_item in line_items_data:
    for field, confidence in line_item.items():
      if confidence < min_confidence:
        irregular_fields.append(field)

  return irregular_fields


def update_document_extraction_metadata(
    document_extraction: dict,
    workflow_id: int,
    file_metadata_id: int
):

    with Session(engine) as session:
        workflow = crud_workflows.get_workflow_by_id(session=session, workflow_id=workflow_id)
        min_confidence = workflow.confidence_interval  
        document_data = document_extraction["extraction"]
        irregular_fields = check_confidence_level(document_data, min_confidence)

        status: FileProcesingStatus

        if irregular_fields:
            status = FileProcesingStatus.FAILED
        else:
            status = FileProcesingStatus.SUCCESS

        dox_id = document_extraction["id"]

        file_metadata = crud_files.get_file_by_id(session=session, file_id=file_metadata_id)
        file_metadata.process_status = status
        file_metadata.dox_id = dox_id
        session.add(file_metadata)
        session.commit()

