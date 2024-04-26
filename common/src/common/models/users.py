"""
  This file contains the Pydantic models for the User entity.
"""
from sqlmodel import Field, SQLModel, Relationship

from typing import TYPE_CHECKING
if TYPE_CHECKING:
  from .workflows import Workflow


class UserBase(SQLModel):
  """
  The basic information of a user.
  """
  username: str = Field(unique=True, index=True)


class UserCreate(UserBase):
  """
  The information needed to create a new user.
  """
  password: str


class User(UserBase, table=True):
  """
    The ORM model for the User entity.
  """
  id: int | None = Field(default=None, primary_key=True)
  hashed_password: str
  workflows: list["Workflow"] = Relationship(back_populates="user")


class UserPublic(UserBase):
  """
    The public information of a user.
  """
  id: int
