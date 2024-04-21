from pymongo import MongoClient
from common.config import settings

engine = MongoClient(str(settings.MONGO_DATABASE_URI))