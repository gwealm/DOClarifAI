# # Installed # #
from pymongo import MongoClient
from pymongo.collection import Collection
from app.core.config import settings



client = MongoClient(settings.MONGO_DATABASE_URI)
collection: Collection = client[settings.database][settings.collection]