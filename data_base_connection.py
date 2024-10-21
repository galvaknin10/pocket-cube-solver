import pymongo

def connect_to_mongo(local_server: str, data_base_name: str, collection_name: str):
    """
    Establishes a connection to a MongoDB server and returns the MongoDB client, database, and collection objects.
    
    Parameters:
    - local_server (str): The connection URI or server address for the MongoDB instance.
      Example: "mongodb://localhost:27017/" for a local MongoDB server.
    
    - data_base_name (str): The name of the database you want to connect to within MongoDB.
      If the database does not exist, MongoDB will create it once you insert data.
      Example: "my_database"
    
    - collection_name (str): The name of the collection within the specified database.
      Collections are like tables in relational databases.
      Example: "my_collection"

    Returns:
    - tuple: A tuple containing three elements:
        - mongo_client: The MongoDB client object which can be used for further database interactions.
        - db: The database object where you can create/read/update collections and documents.
        - collection: The collection object to directly work with data in the specified collection.
    
    Example usage:
    >>> mongo_client, db, collection = connect_to_mongo("mongodb://localhost:27017/", "my_database", "my_collection")
    """
    
    # Create a connection to the MongoDB server using the provided URI (local_server)
    mongo_client = pymongo.MongoClient(local_server)
    
    # Access the specified database within the connected MongoDB instance
    db = mongo_client[data_base_name]
    
    # Access the specified collection within the database
    collection = db[collection_name]

    # Return the client, database, and collection objects
    return mongo_client, collection


