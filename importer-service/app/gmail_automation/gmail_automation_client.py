import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from fastapi import UploadFile
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import tempfile


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
                attachment_files.append(UploadFile(temp_file,filename=filename))

    except HttpError as error:
        print(f'An error occurred: {error}')

    return sender, receiver, attachment_files
        

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

    
    def get_docs_from_email(self):
        self._fetch_token()
        try:
            service = build("gmail", "v1", credentials=self._creds)
            messages = service.users().messages().list(userId="me", labelIds=['UNREAD']).execute()
            if "messages" in messages:
                for message in messages["messages"]:
                    msg_id = message["id"]
                    sender, receiver, message_attachments = _get_message_info(service, "me", msg_id)
                    print(f"sender: {sender}, receiver: {receiver}, nrAttachments: {message_attachments}")
                    raise Exception(f"sender: {sender}, receiver: {receiver}, nrAttachments: {message_attachments}")
                    service.users().messages().modify(userId="me", id=msg_id, body={'removeLabelIds': ['UNREAD']}).execute()


        except HttpError as error:
            print(f"An error occurred: {error}")