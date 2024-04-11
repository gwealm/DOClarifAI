from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlmodel import Session
from app.core.config import settings
from app.core.db import engine
from app.models.users import User
from app.models.tokens import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"/login/access-token")


def get_db() -> Generator[Session, None, None]:
  with Session(engine) as session:
    yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
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
