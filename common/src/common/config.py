"""Global configuration settings for the application."""
from pydantic_core import MultiHostUrl
from pydantic import (
    PostgresDsn,
    computed_field,
)

from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


def read_key_from_file(file_path) -> str | None:
  """
    Read a key from a file.
    Args:
      file_path: The path to the file
    Returns:
      str: The content of the file
    """
  if not os.path.exists(file_path):
    return None
  with open(file_path, "r", encoding="utf-8") as file:
    key = file.read()
  return key


class Settings(BaseSettings):
  """
    Global configuration settings for the application.
    """
  PRIVATE_KEY_FILE: str | None = "ES256/private.ec.key"
  PUBLIC_KEY_FILE: str | None = "ES256/public.pem"
  PRIVATE_KEY: str | None = read_key_from_file(PRIVATE_KEY_FILE)
  PUBLIC_KEY: str | None = read_key_from_file(PUBLIC_KEY_FILE)
  JWT_ALGORITHM: str | None = "ES256"
  
  SAP_CLIENT_ID: str|None = os.getenv("SAP_CLIENT_ID")
  SAP_CLIENT_SECRET: str|None = os.getenv("SAP_CLIENT_SECRET")
  SAP_BASE_URL: str|None = os.getenv("SAP_BASE_URL")
  SAP_UAA_URL: str|None = os.getenv("SAP_UAA_URL")

  # 60 minutes * 24 hours * 8 days = 8 days
  ACCESS_TOKEN_EXPIRE_MINUTES: int | None = 60 * 24 * 8

  POSTGRES_HOST: str | None = os.getenv("POSTGRES_HOST")
  POSTGRES_PORT: int | None = os.getenv("POSTGRES_PORT")
  POSTGRES_USER: str | None = os.getenv("POSTGRES_USER")
  POSTGRES_PASSWORD: str | None = os.getenv("POSTGRES_PASSWORD")
  POSTGRES_DB: str | None = os.getenv("POSTGRES_DB")

  @computed_field
  @property
  def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
    return MultiHostUrl.build(
        scheme="postgresql+psycopg",
        username=self.POSTGRES_USER,
        password=self.POSTGRES_PASSWORD,
        host=self.POSTGRES_HOST,
        port=self.POSTGRES_PORT,
        path=self.POSTGRES_DB,
    )

  TOKEN_URL: str | None = os.getenv("TOKEN_URL")


settings = Settings()
