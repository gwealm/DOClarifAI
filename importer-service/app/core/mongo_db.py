"""
MongoDB connection
"""

from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(str(settings.MONGO_DATABASE_URI))
