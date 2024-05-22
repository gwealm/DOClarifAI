"""
  Dependencies for FastAPI endpoints
"""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlmodel import Session
from common.config import settings
from common.postgres import engine
from common.models.users import User

# DO NOT DELETE. 
from common.models.workflows import Workflow
from common.models.templates import Template
from common.models.files import File
from common.models.schemas import Schema

from common.models.tokens import TokenPayload
from common.document_information_extraction_client.dox_api_client import DoxApiClient

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=settings.TOKEN_URL)


def get_postgres_db() -> Generator[Session, None, None]:
  """
    Get a PostgresDB session
  """
  with Session(engine) as session:
    yield session


PostgresDB = Annotated[Session, Depends(get_postgres_db)]
OAuth2Token = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: PostgresDB, token: OAuth2Token) -> User:
  """
  Get the current user from the JWT token
  """
  try:
    payload = jwt.decode(token,
                         settings.PUBLIC_KEY,
                         algorithms=[settings.JWT_ALGORITHM])
    token_data = TokenPayload(**payload)
  except (JWTError, ValidationError):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Your session has ended or is invalid",
    )
  user = session.get(User, token_data.sub)
  if not user:
    raise HTTPException(status_code=404, detail="User account associated with session no longer exists")
  return user


CurrentUser = Annotated[User, Depends(get_current_user)]


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

