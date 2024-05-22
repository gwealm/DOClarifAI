"""
This module contains the functions to interact with the database.
"""

from pymongo.database import Database
from common.models.users import User
from common.models.workflows import Workflow
from common.models.templates import Template
from common.models.files import File, FileProcesingStatus
from common.crud.postgres import files as crud_files
from common.crud.postgres import workflows as crud_workflows
from common.postgres import engine

from sqlmodel import Session
import os


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


def upload_document_extraction(
    mongo_db: Database,
    document_extraction: dict,
    workflow_id: int,
    file_metadata_id: int
):
  """
    Stores the extracted information from a document in the database.
    Checks if all fields have a confidence
      level above the minimum required.
    If not, the document is stored in the file system.
    """
  with Session(engine) as session:
    workflow:Workflow = crud_workflows.get_workflow_by_id(session=session, workflow_id=workflow_id)
    min_confidence = workflow.confidence_interval  
    document_data = document_extraction["extraction"]
    irregular_fields = check_confidence_level(document_data, min_confidence)

    status: FileProcesingStatus

    if irregular_fields:
      status = FileProcesingStatus.FAILED
      document_extraction["processed"] = False
    else:
      status = FileProcesingStatus.SUCCESS
      document_extraction["processed"] = True

    collection = mongo_db["documents"]

    collection.insert_one(document_extraction)
    dox_id = document_extraction["id"]

    file_metadata = crud_files.get_file_by_id(session=session,
                                              file_id=file_metadata_id)
    file_metadata.process_status = status
    file_metadata.dox_id = dox_id
    session.add(file_metadata)
    session.commit()
