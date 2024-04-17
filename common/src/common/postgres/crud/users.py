"""
  This module contains the CRUD operations for the User ORM.
"""
from sqlmodel import Session, select
from common.security import get_password_hash, verify_password
from common.postgres.models.users import User, UserCreate



def create_user(*, session: Session, user_create: UserCreate) -> User:
  """
  Create a new user.
  Args:
    session: PostgresDB session
    user_create: New user information
  Returns:
    User: The created user
  """
  db_obj = User.model_validate(
      user_create,
      update={"hashed_password": get_password_hash(user_create.password)})
  session.add(db_obj)
  session.commit()
  session.refresh(db_obj)
  return db_obj



def get_user_by_username(*, session: Session, username: str) -> User | None:
  """
    Get a user by username.
    Args:
      session: PostgresDB session
      username: The username to search
    Returns:
      User | None: The user found or None
  """
  statement = select(User).where(User.username == username)
  session_user = session.exec(statement).first()
  return session_user



def authenticate(*, session: Session, username: str,
                 password: str) -> User | None:
  """
    Given an username and a password, authenticate the user.
    Args:
      session: PostgresDB session
      username: The username to authenticate
      password: The password to authenticate
    Returns:
      User | None: The authenticated user or None if the user
        is not found or the password is incorrect
  """
  db_user = get_user_by_username(session=session, username=username)
  if not db_user:
    return None
  if not verify_password(password, db_user.hashed_password):
    return None
  return db_user
