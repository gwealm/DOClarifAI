"""
    This module contains the dependencies used in the FastAPI application.
"""

from collections.abc import Generator
from typing import Annotated
from pymongo.database import Database
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlmodel import Session
from app.core.config import settings
from app.core.postgres_db import engine
from app.models.users import User
from app.models.tokens import TokenPayload
from app.document_information_extraction_client.dox_api_client import DoxApiClient
from app.core.mongo_db import client as mongo_client

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=settings.TOKEN_URL)
mongo_db: Database = mongo_client[settings.MONGO_DB]


def get_postgres_db() -> Generator[Session, None, None]:
  with Session(engine) as session:
    yield session


def get_mongo_db() -> Database:
  return mongo_db


PostgresDB = Annotated[Session, Depends(get_postgres_db)]
MongoDB = Annotated[Database, Depends(get_mongo_db)]
OAuth2Token = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: PostgresDB, token: OAuth2Token) -> User:
  try:
    payload = jwt.decode(token,
                         settings.PUBLIC_KEY,
                         algorithms=[settings.JWT_ALGORITHM])
    token_data = TokenPayload(**payload)
  except (JWTError, ValidationError):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Could not validate credentials",
    )
  user = session.get(User, token_data.sub)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
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
