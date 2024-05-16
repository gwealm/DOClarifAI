import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from fastapi import UploadFile
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import tempfile
from starlette.datastructures import Headers as Headers
from app.document_information_extraction_client.dox_api_client import DoxApiClient
from app.core.config import settings
import app.crud.documents as crud_documents
from app.api.deps import get_mongo_db
from common.deps import get_postgres_db
import re
import asyncio

dox_client:DoxApiClient = DoxApiClient(settings.SAP_BASE_URL,
                                   settings.SAP_CLIENT_ID,
                                   settings.SAP_CLIENT_SECRET,
                                   settings.SAP_UAA_URL)
mongo_db = get_mongo_db()
postgres_db = get_postgres_db()


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

def _get_message_info(service, user_id, msg_id):
    """Get attachments and other information from a Message with given id.

    :param service: Authorized Gmail API service instance.
    :param user_id: User's email address. The special value "me" can be used to indicate the authenticated user.
    :param msg_id: ID of Message containing attachment.
    :return: Tuple containing sender email, receiver email, list of attachments (UploadFile instances).
    """
    sender = None
    receiver = None
    attachment_files = []

    try:
        message = service.users().messages().get(userId=user_id, id=msg_id).execute()

        # Extract sender and receiver from message headers
        headers = message.get('payload', {}).get('headers', [])
        for header in headers:
            if header['name'] == 'From':
                sender = header['value']
            elif header['name'] == 'To':
                receiver = header['value']

        for part in message['payload']['parts']:
            if part['filename']:
                if 'data' in part['body']:
                    data = part['body']['data']
                else:
                    att_id = part['body']['attachmentId']
                    att = service.users().messages().attachments().get(userId=user_id, messageId=msg_id, id=att_id).execute()
                    data = att['data']
                file_data = base64.urlsafe_b64decode(data.encode('UTF-8'))
                filename = part['filename']
                content_type = part['mimeType']
                temp_file = tempfile.SpooledTemporaryFile()
                temp_file.write(file_data)
                temp_file.seek(0)
                
                attachment_files.append(UploadFile(temp_file,filename=filename,headers={"content-type":content_type}))

    except HttpError as error:
        print(f'An error occurred: {error}')

    return sender, receiver, attachment_files
        

def document_extracted_callback_partial(mongo_db,
                                        postgres_db,
                                        workflow_id: int,
                                        file_contents: bytes,
                                        file_name: str):

    def store_structured_info(document_extraction: dict):
        return crud_documents.upload_document_extraction(
            mongo_db, postgres_db, workflow_id, document_extraction,
            file_contents, file_name)

    return store_structured_info


class GmailAutomationClient:
    def __init__(self):
        self._creds = None
        self._SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]

    
    def _fetch_token(self):
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        self._creds = Credentials.from_authorized_user_file("google_oauth2_token/token.json", self._SCOPES)
        # If there are no (valid) credentials available, let the user log in.
        if not self._creds.valid:
            if self._creds and self._creds.expired and self._creds.refresh_token:
                self._creds.refresh(Request())
            else:
                raise Exception("Google OAuth2 token is invalid")

    
    async def get_docs_from_email(self):
        self._fetch_token()
        try:
            service = build("gmail", "v1", credentials=self._creds)
            messages = service.users().messages().list(userId="me", labelIds=['UNREAD']).execute()
            if "messages" in messages:
                for message in messages["messages"]:
                    msg_id = message["id"]
                    sender, receiver, message_attachments = _get_message_info(service, "me", msg_id)
                    pattern = r"(?<=\+)[^+@]+(?=@)"
                    match = re.search(pattern, receiver)
                    if not match:
                        continue
                    
                    #TODO: verify sender can send for this workflow, get workflow id and document template from db
                    workflow_id = int(match[0])
                    for attachment in message_attachments:
                        file_contents = await attachment.read()

                        document_extracted_callback = document_extracted_callback_partial(
                            mongo_db, postgres_db, workflow_id, file_contents, attachment.filename
                        )
                        def create_background_task(get_extraction_for_document, document_id,
                                                    document_extracted_callback):
                            asyncio.create_task(get_extraction_for_document(document_id,document_extracted_callback))
                        
                        await dox_client.upload_document(
                            attachment, DEFAULT_CLIENT_ID, DEFAULT_DOCUMENT_TYPE, create_background_task,
                            document_extracted_callback, DEFAULT_HEADER_FIELDS,
                            DEFAULT_LINE_ITEM_FIELDS
                        )
                    service.users().messages().modify(userId="me", id=msg_id, body={'removeLabelIds': ['UNREAD']}).execute()

        except HttpError as error:
            print(f"An error occurred: {error}")