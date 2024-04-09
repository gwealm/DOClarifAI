import json
import logging
import os
from typing import List, Union
from app.http_client.http_client_base import CommonClient
from .constants import API_FIELD_CLIENT_ID, API_FIELD_RETURN_NULL, API_REQUEST_FIELD_FILE, API_REQUEST_FIELD_OPTIONS
from fastapi import UploadFile, HTTPException, BackgroundTasks
from .endpoints import DOCUMENT_ENDPOINT, DOCUMENT_ID_ENDPOINT
from .helpers import create_document_options
from pymongo import MongoClient


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
            url_path_prefix (str, optional): The prefix for API URL paths. Defaults to 'document-information-extraction/v1/'.
            polling_sleep (int, optional): The interval between polling attempts (in seconds). Defaults to 5.
            polling_max_attempts (int, optional): The maximum number of polling attempts. Defaults to 60.
            logging_level (int, optional): The logging level. Defaults to logging.WARNING.
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
                            background_tasks: BackgroundTasks,
                            header_fields: Union[str, List[str]] = None,
                            line_item_fields: Union[str, List[str]] = None,
                            template_id=None,
                            schema_id=None) -> dict:
    """
        Submits a PDF document for processing and initiates a background task to poll until the results are ready.

        Args:
            document (UploadFile): The PDF document to submit for processing.
            client_id (str): The client ID associated with the document.
            document_type (str): The type of the document.
            background_tasks (BackgroundTasks): Background tasks manager for asynchronous processing.
            header_fields (Union[str, List[str]], optional): Header fields to extract. Defaults to None.
            line_item_fields (Union[str, List[str]], optional): Line item fields to extract. Defaults to None.
            template_id (Any, optional): The template ID for document extraction. Defaults to None.
            schema_id (Any, optional): The schema ID for document extraction. Defaults to None.

        Returns:
            dict: The JSON response containing information about the submitted document.
        """
    options = create_document_options(client_id, document_type, header_fields,
                                      line_item_fields, template_id, schema_id)

    client_id = options.get(API_FIELD_CLIENT_ID)
    self.logger.debug(
        f'Starting upload of {document.filename} documents for client {client_id}'
    )

    response = await self.post(
        DOCUMENT_ENDPOINT,
        files={
            API_REQUEST_FIELD_FILE:
                (document.filename, document.file, document.content_type)
        },
        data={API_REQUEST_FIELD_OPTIONS: json.dumps(options)})

    self.logger.info(
        f'Finished uploading {document.filename}  for client {client_id}')

    response_json = response.json()

    if "id" not in response_json:
      raise HTTPException(status_code=500)

    document_id: int = response_json["id"]
    background_tasks.add_task(self.get_extraction_for_document, document_id)
    return response_json

  async def get_extraction_for_document(self,
                                        document_id,
                                        return_null_values: bool = False
                                       ) -> dict:
    """
        Polls the DOX API for a document identified by its ID until the extraction results are ready.
        Stores the results in the mongodb document database (lgp database, documents collection).
        Args:
            document_id: The ID of the document for which extraction results are requested.
            return_null_values (bool, optional): Flag indicating whether to include null values in the extraction results.
                Defaults to False.

        Returns:
            dict: A dictionary containing the extraction results for the document.
        """
    params = {API_FIELD_RETURN_NULL: return_null_values}

    response = await self._poll_for_url(
        DOCUMENT_ID_ENDPOINT.format(document_id=document_id),
        params=params,
        log_msg_before=f'Getting extraction for document with ID {document_id}',
        log_msg_after=
        f'Successfully got extraction for document with ID {document_id}')

    logging.debug(f"Document {document_id} processed!")
    logging.debug(response.json())
    user = os.getenv('MONGO_INITDB_ROOT_USERNAME')
    pwd = os.getenv('MONGO_INITDB_ROOT_PASSWORD')
    mongo_client = MongoClient('mongodb://'+user+':'+pwd+'@mongo:27017/')
    #switch to lgp database
    db = mongo_client.lgp
    #switch to the document collection
    collection = db.documents
    #insert the document into the collection
    collection.insert_one(response.json())
    return response.json()