from pymongo import MongoClient
from pymongo import ASCENDING, DESCENDING
from typing import List

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "task_manager"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
tasks_collection = db.tasks 

tasks_collection.create_index([("created_at", ASCENDING)])
tasks_collection.create_index([("due_date", ASCENDING)])