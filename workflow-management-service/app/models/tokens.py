"""
  This module contains the pydantic models for the JWT tokens.
"""

from pydantic import BaseModel

class TokenPayload(BaseModel):
  """
    The schema for the JWT token payload.
  """
  sub: int | None = None
