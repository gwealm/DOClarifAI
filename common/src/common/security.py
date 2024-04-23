"""
  This module contains the security functions for the application.
  It includes functions to manage passwords.
"""
from passlib.context import CryptContext

ALGORITHM = "ES256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
  """
    Verify a password.
    Args:
      plain_password: The plain password
      hashed_password: The hashed password, as stored in the database
    Returns:
      bool: True if the password is correct, False otherwise
    """
  return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
  """
    Hash a password.
    Args:
      password: The password to hash
    Returns:
      str: The hashed password
    """
  return pwd_context.hash(password)
