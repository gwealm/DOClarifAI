from pymongo import MongoClient
from common.config import settings

client = MongoClient(str(settings.MONGO_DATABASE_URI))