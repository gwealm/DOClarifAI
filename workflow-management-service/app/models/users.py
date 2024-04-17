"""
  This file contains the Pydantic models for the User entity.
"""
from sqlmodel import Field, SQLModel




class UserBase(SQLModel):
  """
  The basic information of a user.
  """
  username: str = Field(unique=True, index=True)


class User(UserBase, table=True):
  """
    The ORM model for the User entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  hashed_password: str
  #TODO: something like workflows:
  #   list["Workflow"] = Relationship(back_populates="owner")
