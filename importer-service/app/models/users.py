from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
  username: str = Field(unique=True, index=True)


class UserCreate(UserBase):
  password: str


class User(UserBase, table=True):
  id: int | None = Field(default=None, primary_key=True)
  hashed_password: str
  #TODO: something like workflows: list["Workflow"] = Relationship(back_populates="owner")


class UserPublic(UserBase):
  id: int
