from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()  # Loads from .env

# Use environment variable for security
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "pocket_cube_db"
COLLECTION_NAME = "cube_tree"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def get_document(state: str) -> dict:
    return collection.find_one({ "state": state })



