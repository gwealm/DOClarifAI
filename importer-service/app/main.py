from fastapi import FastAPI, Depends, HTTPException, UploadFile
from dotenv import load_dotenv
from sap_business_document_processing import DoxApiClient
from typing import Annotated
import os
import shutil

app = FastAPI()
load_dotenv()

CLIENT_ID = os.getenv("SAP_CLIENT_ID")
CLIENT_SECRET = os.getenv("SAP_CLIENT_SECRET")
BASE_URL = os.getenv("SAP_BASE_URL")
UAA_URL = os.getenv("SAP_UAA_URL")
DEFAULT_CLIENT_ID = "default"
DEFAULT_DOCUMENT_TYPE = "invoice"
header_fields = [
    "documentNumber", "taxId", "purchaseOrderNumber", "shippingAmount",
    "netAmount", "senderAddress", "senderName", "grossAmount", "currencyCode",
    "receiverContact", "documentDate", "taxAmount", "taxRate", "receiverName",
    "receiverAddress"
]
line_item_fields = [
    "description", "netAmount", "quantity", "unitPrice", "materialNumber"
]


class DoxApiClientSingleton:
  _instance = None

  def __new__(cls):
    if cls._instance is None:
      cls._instance = DoxApiClient(BASE_URL, CLIENT_ID, CLIENT_SECRET, UAA_URL)
    return cls._instance


@app.get("/")
async def read_main():
  return {"msg": "Hello World"}


@app.post("/upload-file")
async def upload_file(dox_client: Annotated[DoxApiClient,
                                            Depends(DoxApiClientSingleton)],
                      file: UploadFile):
  try:
    # Save the uploaded file to a temporary location
    with open(file.filename, "wb") as buffer:
      shutil.copyfileobj(file.file, buffer)

    # Extract information from the uploaded file
    extracted_info = dox_client.extract_information_from_document(
        document_path=file.filename,
        client_id=DEFAULT_CLIENT_ID,
        document_type=DEFAULT_DOCUMENT_TYPE,
        mime_type=file.content_type,
        header_fields=header_fields,
        line_item_fields=line_item_fields)

    return extracted_info

  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
