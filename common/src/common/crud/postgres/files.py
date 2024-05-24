"""
  This module contains the CRUD operations for the File ORM.
"""
from sqlmodel import Session, select
from common.models.files import File, FileCreate
from common.models.workflows import Workflow
from common.crud.postgres import files as crud_files
from common.document_information_extraction_client.dox_api_client import DoxApiClient
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
  return await dox_client.get_original_uploaded_document(file.dox_id)

async def get_extracted_results_by_id_xlsx(*,session:Session, file_id: str, dox_client: DoxApiClient) -> str:
  document:dict = await crud_files.get_extracted_results_by_id(session=session, file_id=file_id, dox_client=dox_client)
  if not document:
    return None
  document_data = document[0]["extraction"]
  formatted_document = format_document(document_data)
  _, path = tempfile.mkstemp(suffix=".xlsx")
  formatted_document.to_excel(path, index=False)
  return path