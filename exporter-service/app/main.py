from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import os
from pymongo import MongoClient
import pandas as pd

app = FastAPI()
load_dotenv()

MONGO_USER = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")

mongo_client = MongoClient(f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@mongo:27017/")
db = mongo_client.lgp
collection = db.documents

def format_document(data: dict):
  """
  This function formats the document data into a DataFrame, for invoice data extraction.
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

@app.get("/")
async def read_main():
  return {"msg": "Hello World"}

@app.get("/export-document-excel")
async def export_document_excel(document_id: str = Query(..., description="The ID of the document to download"))-> FileResponse:
  """
    This endpoint lets the client download a document in xlsx format.
  """
  document = collection.find({"id": document_id})
  if document is None:
    raise HTTPException(status_code=404, detail="Document not found")
  document_data = document[0]["extraction"]
  formatted_document = format_document(document_data)
  formatted_document.to_excel("output.xlsx", index=False)

  return FileResponse("output.xlsx", filename="output.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

@app.get("/list-documents")
async def list_documents():
  """
    This endpoint returns a list of all documents in the database.
    TODO: In the future it must only return the documents for a specific user and workflow.
  """
  documents = collection.find({})
  # Retrieve only the json with the id, timestamp and filename
  documents_data = [{"id": document["id"], "timestamp": document["finished"], "filename": document["fileName"]} for document in documents]
  #sort the documents by timestamp
  documents_data = sorted(documents_data, key=lambda x: x["timestamp"], reverse=True)
  return documents_data
