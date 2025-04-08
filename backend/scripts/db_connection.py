import pymongo

def connect_to_mongo(local_server: str, database_name: str, collection_name: str):
    """
    Establishes a connection to a MongoDB server and returns the MongoDB client and collection objects.

    Parameters:
        local_server (str): The MongoDB URI or server address.
            Example: "mongodb://localhost:27017/" for a local MongoDB server.
        
        database_name (str): The name of the database to connect to.
            MongoDB will create the database if it doesn't already exist when data is inserted.
            Example: "pocket_cube_db"
        
        collection_name (str): The name of the collection within the specified database.
            MongoDB will create the collection if it doesn't already exist.
            Example: "cube_tree"

    Returns:
        tuple: A tuple containing:
            - mongo_client: The MongoDB client object for further interactions.
            - collection: The collection object for working directly with data in the specified collection.

    Raises:
        pymongo.errors.ConnectionError: If the connection to the MongoDB server fails.

    Example Usage:
        >>> mongo_client, collection = connect_to_mongo("mongodb://localhost:27017/", "my_database", "my_collection")
    """
    try:
        # Create a connection to the MongoDB server using the provided URI
        mongo_client = pymongo.MongoClient(local_server)

        # Access the specified database
        db = mongo_client[database_name]

        # Access the specified collection within the database
        collection = db[collection_name]

        # Return the client and collection objects
        return mongo_client, collection
    except pymongo.errors.ConnectionError as e:
        raise pymongo.errors.ConnectionError(f"Failed to connect to MongoDB server: {e}")
