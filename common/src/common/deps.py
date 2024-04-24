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
from common.models.tokens import TokenPayload

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
        detail="Could not validate credentials",
    )
  user = session.get(User, token_data.sub)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  return user


CurrentUser = Annotated[User, Depends(get_current_user)]
