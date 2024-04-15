from fastapi import APIRouter, HTTPException, UploadFile, BackgroundTasks
from app.models.document_status import DocumentStatus
from app.api.deps import MongoDB, CurrentUser, DoxClient
from app.crud import documents as crud_documents
router = APIRouter()


@router.post("/{workflow_id}", status_code=202)
async def upload_file(dox_client: DoxClient, current_user: CurrentUser,
                      db:MongoDB, file: UploadFile,
                      background_tasks: BackgroundTasks, workflow_id:int) -> DocumentStatus:
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
    
    def document_extracted_callback_partial(db:MongoDB,workflow_id:id):
      def store_structured_info(document_extraction:dict):
        return crud_documents.upload_document_extraction(db,workflow_id,document_extraction)
      return store_structured_info
    
    document_extracted_callback = document_extracted_callback_partial(db,workflow_id)
    
    extracted_info = await dox_client.upload_document(file, DEFAULT_CLIENT_ID,
                                                      DEFAULT_DOCUMENT_TYPE,
                                                      background_tasks,
                                                      document_extracted_callback,
                                                      DEFAULT_HEADER_FIELDS,
                                                      DEFAULT_LINE_ITEM_FIELDS)
    return extracted_info
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
