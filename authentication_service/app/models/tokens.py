"""
  This module contains the pydantic models for the JWT tokens.
"""

from pydantic import BaseModel

"""
  The schema for the JWT token returned by the authentication endpoint.
"""
class Token(BaseModel):
  access_token: str
  token_type: str = "bearer"


"""
  The schema for the JWT token payload.
"""
class TokenPayload(BaseModel):
  sub: int | None = None
