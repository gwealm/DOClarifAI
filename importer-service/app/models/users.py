"""
  Models for users.
"""

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
  """
    Base model for users.
  """
  username: str = Field(unique=True, index=True)


class UserCreate(UserBase):
  """
    Model for creating a new user.
  """
  password: str


class User(UserBase, table=True):
  """
    Model for users.
  """
  id: int | None = Field(default=None, primary_key=True)
  hashed_password: str
  """
  TODO: something like workflows:
    list["Workflow"] = Relationship(back_populates="owner")
  """


class UserPublic(UserBase):
  """
    Public model for users.
  """
  id: int
