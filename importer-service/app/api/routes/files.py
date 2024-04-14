from fastapi import APIRouter, HTTPException, UploadFile, BackgroundTasks
from app.models.document_status import DocumentStatus
from app.api.deps import CurrentUser, DoxClient

router = APIRouter()


@router.post("/", status_code=202)
async def upload_file(dox_client: DoxClient, current_user: CurrentUser,
                      file: UploadFile,
                      background_tasks: BackgroundTasks) -> DocumentStatus:
  """
    This asynchronous endpoint lets the client submit a pdf document for processing. 
  """

  flow_owner: str = "user"
  if (False and current_user.username != flow_owner):
    #TODO: get flow_owner from request
    raise HTTPException(status_code=401,
                        detail="Current user is not the owner of this flow")

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
