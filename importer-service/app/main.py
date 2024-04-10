from fastapi import FastAPI, Depends, HTTPException, UploadFile, BackgroundTasks
from dotenv import load_dotenv
from typing import Annotated
from .document_information_extraction_client.dox_api_client import DoxApiClient
from fastapi.middleware.cors import CORSMiddleware
from .models import DocumentStatus
import os

app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
CLIENT_ID = os.getenv("SAP_CLIENT_ID")
CLIENT_SECRET = os.getenv("SAP_CLIENT_SECRET")
BASE_URL = os.getenv("SAP_BASE_URL")
UAA_URL = os.getenv("SAP_UAA_URL")

# Default values
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


class DoxApiClientSingleton:
  """
    Singleton class for managing the instantiation of the DoxApiClient.
    """

  _instance = None

  def __new__(cls):
    """
        Create a new instance of DoxApiClient if it doesn't exist, otherwise return the existing instance.
        """
    if cls._instance is None:
      cls._instance = DoxApiClient(BASE_URL, CLIENT_ID, CLIENT_SECRET, UAA_URL)
    return cls._instance


@app.get("/")
async def read_main():
  return {"msg": "Hello World"}


@app.post("/upload-file", status_code=202)
async def upload_file(dox_client: Annotated[DoxApiClient,
                                            Depends(DoxApiClientSingleton)],
                      file: UploadFile,
                      background_tasks: BackgroundTasks) -> DocumentStatus:
  """
    This asynchronous endpoint lets the client submit a pdf document for processing. 
    """
  try:
    # Upload the file and initiate document extraction
    extracted_info = await dox_client.upload_document(file, DEFAULT_CLIENT_ID,
                                                      DEFAULT_DOCUMENT_TYPE,
                                                      background_tasks,
                                                      DEFAULT_HEADER_FIELDS,
                                                      DEFAULT_LINE_ITEM_FIELDS)
    return extracted_info
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
