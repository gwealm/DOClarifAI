"""
  Users routes.
"""
from typing import Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from common.crud.postgres import users as crud_users
from common.deps import (
    CurrentUser,
    PostgresDB,
    
)
from common.models.users import (User, UserCreate, UserPublic)

router = APIRouter()


@router.post("/", response_model=UserPublic)
def create_user(*, session: PostgresDB, user_in: UserCreate) -> Any:
  """
  Create a new user.
  """
  user = crud_users.get_user_by_username(session=session,
                                         username=user_in.username)
  if user:
    raise HTTPException(
        status_code=400,
        detail="The provided username is already taken",
    )
  user_create = UserCreate.model_validate(user_in)
  user = crud_users.create_user(session=session, user_create=user_create)
  return user


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
  """
  Get current user.
  """
  return current_user


class PasswordChangeRequest(BaseModel):
  new_password :str

@router.post("/me/change-password")
def change_password(session: PostgresDB, current_user: CurrentUser, new_pw: PasswordChangeRequest) -> Any:
  """
  Get current user.
  """
  crud_users.change_user_password(session,current_user,new_pw.new_password)

@router.delete("/{user_id}")
def delete_user(session: PostgresDB, current_user: CurrentUser,
                user_id: int) -> Any:
  """
  Delete the user with the provided ID.
  """
  user = session.get(User, user_id)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  elif user != current_user:
    raise HTTPException(status_code=403,
                        detail="The user doesn't have enough privileges")

  #TODO: Delete all  data related with the user (workflows, documents, etc)

  session.delete(user)
  session.commit()
  return {"message": "User deleted successfully"}
