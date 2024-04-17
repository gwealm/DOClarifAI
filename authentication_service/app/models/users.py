"""
  This file contains the Pydantic models for the User entity.
"""
from sqlmodel import Field, SQLModel



"""
  The basic information of a user.
"""
class UserBase(SQLModel):
  username: str = Field(unique=True, index=True)



"""
  The information needed to create a new user.
"""
class UserCreate(UserBase):
  password: str

"""
  The ORM model for the User entity.
"""
class User(UserBase, table=True):
  id: int | None = Field(default=None, primary_key=True)
  hashed_password: str
  #TODO: something like workflows: list["Workflow"] = Relationship(back_populates="owner")


"""
  The public information of a user.
"""
class UserPublic(UserBase):
  id: int
