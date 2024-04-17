"""
  This module contains the security functions for the application.
  It includes functions to manage JWT tokens and passwords.
"""
from datetime import datetime, timedelta, timezone
from typing import Any
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

ALGORITHM = "ES256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


"""
  Create a new access token.
  Args:
    subject: The subject of the token
    expires_delta: for how long the token will be valid
  Returns:
    str: The encoded token
"""
def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
  expire = datetime.now(timezone.utc) + expires_delta
  to_encode = {"exp": expire, "sub": str(subject)}
  encoded_jwt = jwt.encode(to_encode,
                           settings.PRIVATE_KEY,
                           algorithm=settings.JWT_ALGORITHM)
  return encoded_jwt

"""
  Verify a password.
  Args:
    plain_password: The plain password
    hashed_password: The hashed password, as stored in the database
  Returns:
    bool: True if the password is correct, False otherwise
"""
def verify_password(plain_password: str, hashed_password: str) -> bool:
  return pwd_context.verify(plain_password, hashed_password)


"""
  Hash a password.
  Args:
    password: The password to hash
  Returns:
    str: The hashed password
"""
def get_password_hash(password: str) -> str:
  return pwd_context.hash(password)
