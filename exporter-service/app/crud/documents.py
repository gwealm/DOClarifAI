"""
    This module contains the CRUD for document class
"""
from pymongo.database import Database
from common.models.users import User
import pandas as pd
import tempfile


def format_document(data: dict):
  """
    This function formats the document data into a DataFrame, for invoice data
    extraction.
    """
  header_data = {field["name"]: field["value"] for field in data["headerFields"]}

  # Extract line items
  line_items_data = []
  for line_item in data["lineItems"]:
    line_item_data = {item["name"]: item["value"] for item in line_item}
    line_items_data.append(line_item_data)

  header_df = pd.DataFrame(header_data, index=[0])

  line_items_df = pd.DataFrame(line_items_data)

  result_df = pd.concat([header_df, line_items_df], axis=1)

  return result_df


def get_document_by_id(db: Database, document_id: str) -> dict:
  #TODO: If the document doesn't belong to the user, return 401 unauthorized
  collection = db["documents"]
  document = collection.find({"id": document_id})
  return document


def get_document_by_id_xlsx(db: Database, current_user: User,
                            document_id: str) -> str:
  #TODO: If the document doesn't belong to the user, return 401 unauthorized
  document = get_document_by_id(db, document_id)
  if not document:
    return None
  document_data = document[0]["extraction"]
  formatted_document = format_document(document_data)
  _, path = tempfile.mkstemp(suffix=".xlsx")
  formatted_document.to_excel(path, index=False)
  return path


def get_documents_by_workflow(db: Database, current_user: User,
                              workflow_id: int):
  #TODO: In the future it must only return the documents for a specific workflow.
  #TODO: If the workflow doesn't belong to the user, return 401 unauthorized
  collection = db["documents"]
  pipeline = [{
      "$sort": {
          "finished": -1
      }
  }, {
      "$project": {
          "_id": 0,
          "id": "$id",
          "timestamp": "$finished",
          "filename": "$fileName"
      }
  }]
  documents = collection.aggregate(pipeline)
  return list(documents)
