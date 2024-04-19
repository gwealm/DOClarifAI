"""
This module contains the functions to interact with the database.
"""

from pymongo.database import Database
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


def upload_document_extraction(mongo_db: Database, postgres_session: Session,
                               workflow_id: int, document_extraction: dict,
                               fileContents: bytes, filename: str):
  """
    Stores the extracted information from a document in the database.
    Checks if all fields have a confidence
      level above the minimum required.
    If not, the document is stored in the file system.
    """
  #TODO: Store metadata about the workflow to which the document belongs
  #TODO: Extract the minimum confidence level from the workflow configuration.
  #TODO: In the future, we will substitute the filesystem storage with a cloud storage service.
  min_confidence = 0.9  #TODO: obtain from workflow configuration
  document_data = document_extraction["extraction"]
  irregular_fields = check_confidence_level(document_data, min_confidence)
  if irregular_fields:
    #Check if the workflow directory exists
    workflow_dir = f"files/{workflow_id}"
    if not os.path.exists(workflow_dir):
      os.makedirs(workflow_dir)
    file_path = f"files/{workflow_id}/{filename}"
    with open(file_path, "wb") as f:
      f.write(fileContents)
    document_extraction["processed"] = False
  else:
    #mark the document as processed
    document_extraction["processed"] = True
  collection = mongo_db["documents"]
  collection.insert_one(document_extraction)
