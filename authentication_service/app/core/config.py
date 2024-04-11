from pydantic_core import MultiHostUrl
from pydantic import (
    PostgresDsn,
    computed_field,
)

from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


def read_key_from_file(file_path):
  with open(file_path, "r") as file:
    key = file.read()
  return key


class Settings(BaseSettings):
  PRIVATE_KEY_FILE: str = "ES256/private.ec.key"
  PUBLIC_KEY_FILE: str = "ES256/public.pem"
  PRIVATE_KEY: str = read_key_from_file(PRIVATE_KEY_FILE)
  PUBLIC_KEY: str = read_key_from_file(PUBLIC_KEY_FILE)
  JWT_ALGORITHM: str = "ES256"

  # 60 minutes * 24 hours * 8 days = 8 days
  ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

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
