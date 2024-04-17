"""
Token models
"""
from pydantic import BaseModel


class Token(BaseModel):
  """
  Token model
  
  """
  access_token: str
  token_type: str = "bearer"


class TokenPayload(BaseModel):
  """
  Token payload model
  """
  sub: int | None = None
