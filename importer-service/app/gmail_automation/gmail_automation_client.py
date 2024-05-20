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
from sqlmodel import Session
import re
import asyncio
from email.mime.text import MIMEText

from pymongo.database import Database as MongoDB
from common.models.workflows import Workflow
from common.models.files import FileCreate, FileProcesingStatus
from common.crud.postgres import workflows as crud_workflows
from common.crud.postgres import files as crud_files
from common.postgres import engine
from pathlib import Path



dox_client:DoxApiClient = DoxApiClient(settings.SAP_BASE_URL,
                                   settings.SAP_CLIENT_ID,
                                   settings.SAP_CLIENT_SECRET,
                                   settings.SAP_UAA_URL)
mongo_db = get_mongo_db()


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

        email_pattern = r'<(.*?)>'
        sender_email = re.search(email_pattern, sender)
        if sender_email:
            sender_email = sender_email.group(1)
        else:
            sender_email = sender

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

    return sender_email, receiver, attachment_files
        

def store_unprocessed_file(workflow_id: int, file: UploadFile):
  workflow_dir = Path(f"files/{workflow_id}")
  workflow_dir.mkdir(parents=True, exist_ok=True)

  file_path = workflow_dir / file.filename

  try:
    with open(file_path, "wb") as f:
      content = file.file.read()  # Read the file content
      f.write(content)
  except Exception as e:
    print(f"An error occurred while saving the file: {e}")
    return ""

  return str(file_path)


def document_extracted_callback_partial(mongo_db: MongoDB, workflow_id: int,
                                        file_metadata_id: int,
                                        file_path: str):

    def store_structured_info(document_extraction: dict):
        return crud_documents.upload_document_extraction(mongo_db,
                                                        document_extraction,
                                                        workflow_id,
                                                        file_metadata_id,
                                                        file_path)

    return store_structured_info


def reply_to_email(service, msg_id, message, workflow_id):
    """Reply to the email with a message.

    :param service: Authorized Gmail API service instance.
    :param msg_id: ID of the message to reply to.
    :param message: The message to send.
    :param workflow_id: The workflow ID to include in the sender email.
    """
    try:
        # Get the original message
        original_message = service.users().messages().get(userId="me", id=msg_id).execute()

        # Extract the original sender
        headers = original_message.get('payload', {}).get('headers', [])
        original_sender = None
        original_subject = None
        for header in headers:
            if header['name'] == 'From':
                original_sender = header['value']
            elif header['name'] == 'Subject':
                original_subject = header['value']

        # Create the reply message
        reply_subject = f"Re: {original_subject}" if original_subject else "Re: Your email"
        mime_message = MIMEText(message)
        mime_message['To'] = original_sender
        mime_message['Subject'] = reply_subject
        mime_message['In-Reply-To'] = original_message['id']
        mime_message['References'] = original_message['id']
        mime_message['From'] = f'"Do Not Reply" <doclarifai+{workflow_id}@gmail.com>'

        # Encode the message in base64
        encoded_message = base64.urlsafe_b64encode(mime_message.as_bytes()).decode()

        # Create the message body
        body = {
            'raw': encoded_message,
            'threadId': original_message['threadId'],
        }

        # Send the message
        send_message = service.users().messages().send(userId="me", body=body).execute()
        print(f"Message sent: {send_message['id']}")

    except HttpError as error:
        print(f'An error occurred while replying with error: {error}')

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
                    
                    workflow_id = int(match[0])
                    for attachment in message_attachments:

                        file_path = store_unprocessed_file(workflow_id, attachment)
                        with Session(engine) as session:
                            workflow: Workflow = crud_workflows.get_workflow_by_id(
                                session=session, workflow_id=workflow_id)
                            if not workflow:
                                error_msg = "The workflow with the provided id doesn't exist"
                                reply_to_email(service,msg_id,error_msg,workflow_id)
                                break
                            if workflow.email!=sender:
                                error_msg = "The workflow with the provided id isn't configured to receive emails from this address"
                                reply_to_email(service,msg_id,error_msg,workflow_id)
                                break

                            file_metadata = crud_files.create_file(session=session,
                                                                    file=FileCreate(
                                                                        workflow_id=workflow_id,
                                                                        name=attachment.filename,
                                                                        unprocessed_path=file_path))

                            document_extracted_callback = document_extracted_callback_partial(
                                mongo_db, workflow.id, file_metadata.id, file_metadata.unprocessed_path
                            )

                            def create_background_task(get_extraction_for_document, document_id,
                                                        document_extracted_callback):
                                asyncio.create_task(get_extraction_for_document(document_id,document_extracted_callback))
                            
                            extracted_info = await dox_client.upload_document(
                                attachment, DEFAULT_CLIENT_ID, DEFAULT_DOCUMENT_TYPE, create_background_task,
                                document_extracted_callback, DEFAULT_HEADER_FIELDS,
                                DEFAULT_LINE_ITEM_FIELDS
                            )
                        
                            match extracted_info["status"]:
                                case "PENDING":
                                    file_metadata.process_status = FileProcesingStatus.PROCESSING
                                case _:
                                    file_metadata.process_status = FileProcesingStatus.FAILED
                            session.commit()
                        
                    service.users().messages().modify(userId="me", id=msg_id, body={'removeLabelIds': ['UNREAD']}).execute()

        except HttpError as error:
            print(f"An error occurred: {error}")