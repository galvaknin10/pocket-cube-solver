from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Retrieve MongoDB URI from environment for security
MONGO_URI = os.getenv("MONGO_URI")

# Define database and collection names
DB_NAME = "pocket_cube_db"
COLLECTION_NAME = "cube_tree"

# Initialize MongoDB client and access collection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def get_document(state: str) -> dict:
    """
    Fetch a single document from the collection by cube state.
    """
    return collection.find_one({ "state": state })


