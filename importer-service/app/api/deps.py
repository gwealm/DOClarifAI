"""
    This module contains the dependencies used in the FastAPI application.
"""
from typing import Annotated
from fastapi import Depends
from app.core.config import settings
from common.document_information_extraction_client.dox_api_client import DoxApiClient


class DoxApiClientSingleton:
  """
    Singleton class for managing the instantiation of the DoxApiClient.
    """

  _instance = None

  def __new__(cls):
    """
        Create a new instance of DoxApiClient if it doesn't exist,
          otherwise return the existing instance.
        """
    if cls._instance is None:
      cls._instance = DoxApiClient(settings.SAP_BASE_URL,
                                   settings.SAP_CLIENT_ID,
                                   settings.SAP_CLIENT_SECRET,
                                   settings.SAP_UAA_URL)
    return cls._instance


DoxClient = Annotated[DoxApiClient, Depends(DoxApiClientSingleton)]
