"""
    Client for interacting with the SAP Document Information Extraction API.
"""

import json
import logging
from typing import List, Union
from common.http_client.http_client_base import CommonClient
from .constants import API_FIELD_CLIENT_ID, API_FIELD_RETURN_NULL, API_REQUEST_FIELD_FILE, API_REQUEST_FIELD_OPTIONS
from fastapi import UploadFile, HTTPException, Response
from .endpoints import DOCUMENT_ENDPOINT, DOCUMENT_ID_ENDPOINT, DOCUMENT_FILE_ENDPOINT
from .helpers import create_document_options


class DoxApiClient(CommonClient):
  """
    Client for interacting with the SAP Document Information Extraction API.
    """

  def __init__(self,
               base_url,
               client_id,
               client_secret,
               uaa_url,
               url_path_prefix='document-information-extraction/v1/',
               polling_sleep=5,
               polling_max_attempts=60,
               logging_level=logging.WARNING):
    """
        Initialize the DoxApiClient.

        Args:
            base_url (str): The base URL of the API.
            client_id (str): The client ID for authorization.
            client_secret (str): The client secret for authorization.
            uaa_url (str): The URL for user authentication and authorization.
            url_path_prefix (str, optional): The prefix for API URL paths.
              Defaults to 'document-information-extraction/v1/'.
            polling_sleep (int, optional): The interval between polling
              attempts (in seconds). Defaults to 5.
            polling_max_attempts (int, optional): The maximum number of
              polling attempts. Defaults to 60.
            logging_level (int, optional): 
            The logging level. Defaults to logging.WARNING.
        """
    super(DoxApiClient,
          self).__init__(base_url=base_url,
                         client_id=client_id,
                         client_secret=client_secret,
                         uaa_url=uaa_url,
                         polling_sleep=polling_sleep,
                         polling_max_attempts=polling_max_attempts,
                         url_path_prefix=url_path_prefix,
                         logger_name='DoxApiClient',
                         logging_level=logging_level)

  async def upload_document(self,
                            document: UploadFile,
                            client_id,
                            document_type: str,
                            create_background_task_callback,
                            document_extracted_callback,
                            header_fields: Union[str, List[str]] = None,
                            line_item_fields: Union[str, List[str]] = None,
                            template_id=None,
                            schema_id=None) -> dict:
    """
        Submits a PDF document for processing and initiates a 
        background task to poll until the results are ready.

        Args:
            document (UploadFile): The PDF document to submit for processing.
            client_id (str): The client ID associated with the document.
            document_type (str): The type of the document.
            background_tasks (BackgroundTasks): Background tasks
              manager for asynchronous processing.
            header_fields (Union[str, List[str]], optional): Header
              fields to extract. Defaults to None.
            line_item_fields (Union[str, List[str]], optional): Line
              item fields to extract. Defaults to None.
            template_id (Any, optional): The template ID for document
              extraction. Defaults to None.
            schema_id (Any, optional): The schema ID for document
              extraction. Defaults to None.

        Returns:
            dict: The JSON response containing information
              about the submitted document.
        """
    options = create_document_options(client_id, document_type, header_fields,
                                      line_item_fields, template_id, schema_id)

    client_id = options.get(API_FIELD_CLIENT_ID)
    self.logger.debug('Starting upload of %s documents for client %s',
                      document.filename, client_id)

    response = await self.post(
        DOCUMENT_ENDPOINT,
        files={
            API_REQUEST_FIELD_FILE:
                (document.filename, document.file, document.content_type)
        },
        data={API_REQUEST_FIELD_OPTIONS: json.dumps(options)})

    self.logger.info('Successfully uploaded document %s for client %s',
                     document.filename, client_id)

    response_json = response.json()

    if 'id' not in response_json:
      raise HTTPException(status_code=500)

    document_id: str = response_json['id']
    create_background_task_callback(self.get_extraction_for_document, document_id,
                              document_extracted_callback)
    return response_json

  async def get_extraction_for_document(
      self,
      document_id,
      document_extracted_callback,
      return_null_values: bool = False) -> dict:
    """
        Polls the DOX API for a document identified by its
          ID until the extraction results are ready.
        Stores the results in the mongodb document database
          (lgp database, documents collection).
        Args:
            document_id: The ID of the document for which
              extraction results are requested.
            return_null_values (bool, optional): Flag indicating
              whether to include null values in the extraction results.
                Defaults to False.

        Returns:
            dict: A dictionary containing
              the extraction results for the document.
        """
    
    params = {API_FIELD_RETURN_NULL: return_null_values}

    response = await self._poll_for_url(
        DOCUMENT_ID_ENDPOINT.format(document_id=document_id),
        params=params,
        log_msg_before=f'Getting extraction for document with ID {document_id}',
        log_msg_after=
        f'Successfully got extraction for document with ID {document_id}')

    extracted_document = response.json()
    logging.debug('Document %s processed!', document_id)
    logging.debug(extracted_document)
    document_extracted_callback(extracted_document)
    return extracted_document
  
  async def get_original_uploaded_document(self, document_id):
    file_response =  await self.get(DOCUMENT_FILE_ENDPOINT.format(document_id=document_id))
    file_response.raise_for_status()

    content = file_response.content
    content_type = file_response.headers.get('Content-Type')

    return Response(content=content, media_type=content_type)
