"""
  This module contains the fastapi dependencies used throughout the 
  exporter service
"""
from typing import Annotated
from fastapi import Depends
from pymongo.database import Database
from app.core.config import settings
from app.core.mongo_db import client as mongo_client

mongo_db: Database = mongo_client[settings.MONGO_DB]


def get_mongo_db() -> Database:
  return mongo_db


MongoDB = Annotated[Database, Depends(get_mongo_db)]
