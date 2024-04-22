"""
  This module contains the security functions for the application.
  It includes functions to manage JWT tokens.
"""
from datetime import datetime, timedelta, timezone
from typing import Any
from jose import jwt
from common.config import settings


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    """
    Create a new access token.
    Args:
      subject: The subject of the token
      expires_delta: for how long the token will be valid
    Returns:
      str: The encoded token
    """
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode,
                             settings.PRIVATE_KEY,
                             algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt
