from pydantic_core import MultiHostUrl
from pydantic import (PostgresDsn, computed_field, HttpUrl)

from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


def read_key_from_file(file_path):
  with open(file_path, "r") as file:
    key = file.read()
  return key


class Settings(BaseSettings):
  PUBLIC_KEY_FILE: str = "ES256/public.pem"
  PUBLIC_KEY: str = read_key_from_file(PUBLIC_KEY_FILE)
  JWT_ALGORITHM: str = "ES256"
  SAP_CLIENT_ID: str = os.getenv("SAP_CLIENT_ID")
  SAP_CLIENT_SECRET: str = os.getenv("SAP_CLIENT_SECRET")
  SAP_BASE_URL: str = os.getenv("SAP_BASE_URL")
  SAP_UAA_URL: str = os.getenv("SAP_UAA_URL")
  TOKEN_URL: str = os.getenv("TOKEN_URL")
  POSTGRES_HOST: str = os.getenv("POSTGRES_HOST")
  POSTGRES_PORT: int = os.getenv("POSTGRES_PORT")
  POSTGRES_USER: str = os.getenv("POSTGRES_USER")
  POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
  POSTGRES_DB: str = os.getenv("POSTGRES_DB")

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


settings = Settings()
