import json
import logging
from typing import List,Union
from app.http_client.http_client_base import CommonClient
from .constants import API_FIELD_CLIENT_ID, API_FIELD_RETURN_NULL, API_REQUEST_FIELD_FILE, API_REQUEST_FIELD_OPTIONS
from fastapi import UploadFile,HTTPException,BackgroundTasks
from .endpoints import DOCUMENT_ENDPOINT, DOCUMENT_ID_ENDPOINT
from .helpers import create_document_options
    


class DoxApiClient(CommonClient):
    def __init__(self,
                 base_url,
                 client_id,
                 client_secret,
                 uaa_url,
                 url_path_prefix='document-information-extraction/v1/',
                 polling_sleep=5,
                 polling_max_attempts=60,
                 logging_level=logging.WARNING):
        super(DoxApiClient, self).__init__(base_url=base_url,
                                           client_id=client_id,
                                           client_secret=client_secret,
                                           uaa_url=uaa_url,
                                           polling_sleep=polling_sleep,
                                           polling_max_attempts=polling_max_attempts,
                                           url_path_prefix=url_path_prefix,
                                           logger_name='DoxApiClient',
                                           logging_level=logging_level)

   
    async def upload_document(self, document:UploadFile, client_id,document_type: str,background_tasks: BackgroundTasks,
                                           header_fields: Union[str, List[str]] = None,
                                           line_item_fields: Union[str, List[str]] = None, template_id=None,
                                           schema_id=None)->dict:
        
        options = create_document_options(client_id, document_type, header_fields, line_item_fields, template_id,
                                          schema_id)
   
        client_id = options.get(API_FIELD_CLIENT_ID)
        self.logger.debug(
            f'Starting upload of {document.filename} documents for client {client_id}')

        response = await self.post(DOCUMENT_ENDPOINT,
                                 files={API_REQUEST_FIELD_FILE: (document.filename, document.file, document.content_type)},
                                 data={API_REQUEST_FIELD_OPTIONS: json.dumps(options)})

        
        self.logger.info(f'Finished uploading {document.filename}  for client {client_id}')
    
        response_json = response.json()

        if "id" not in response_json:
            raise HTTPException(status_code=500)
        
        document_id: int = response_json["id"]
        background_tasks.add_task(self.get_extraction_for_document,document_id)
        return response_json


    async def get_extraction_for_document(self, document_id, return_null_values: bool = False) -> dict:

        params = {
            API_FIELD_RETURN_NULL: return_null_values
        }

        response = await self._poll_for_url(DOCUMENT_ID_ENDPOINT.format(document_id=document_id), params=params,
                                      log_msg_before=f'Getting extraction for document with ID {document_id}',
                                      log_msg_after=f'Successfully got extraction for document with ID {document_id}')
        
        logging.debug(f"Document {document_id} processed!")
        logging.debug(response.json())

