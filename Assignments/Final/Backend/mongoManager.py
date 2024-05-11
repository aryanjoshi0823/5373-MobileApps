from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure, PyMongoError
from bson.objectid import ObjectId
import sys

class MongoManager:
    def __init__(self, **kwargs):
        self.client = None
        self.db = None
        self.collection = None

        self.host = kwargs.get("host", "localhost")
        self.port = kwargs.get("port", 27017)  # Default MongoDB port
        self.username = kwargs.get("username")
        self.password = kwargs.get("password")
        self.auth_source = kwargs.get("auth_source", "admin")
        self.db = kwargs.get("db", None)
        self.collection = kwargs.get("collection", None)
        self.connect()

    def connect(self):
        try:
            if self.username and self.password:
                self.client = MongoClient(
                    self.host,
                    self.port,
                    username=self.username,
                    password=self.password,
                    authSource=self.auth_source
                )
            else:
                self.client = MongoClient(self.host, self.port)
        except ConnectionFailure as e:
            print(f"Failed to connect to MongoDB: {e}")
            return

    def set_database(self, db_name):
        self.db = db_name
        self.client.admin.command("isMaster")

    def set_collection(self, collection_name):
        if self.db is not None:  
            if collection_name in self.client[self.db].list_collection_names():
                self.collection = self.client[self.db][collection_name]
                print(f"Collection set to {collection_name}")
            else:
                print(
                    f"Collection {collection_name} does not exist. Creating {collection_name}."
                )
                self.collection = self.client[self.db].create_collection(collection_name)
        else:
            print("No database selected. Use set_database() first.")

    def update(self, query, update):
        try:
            if self.collection:
                self.collection.update_many(query, update)
                return True
            else:
                print("No collection selected. Use set_collection() first.")
        except PyMongoError as e:
            print(f"Error updating document: {e}")
            return False

    def distinct(self, field):
        try:
            if self.collection is not None:
                return self.collection.distinct(field)
            else:
                print("No collection selected. Use set_collection() first.")
                return []
        except PyMongoError as e:
            print(f"Error getting distinct values: {e}")
            return []

    def get(self, query=None, filter=None, sort=None, skip=0, limit=0):
        try:
            if self.collection is not None:
                cursor = self.collection.find(query, filter).skip(skip).limit(limit)
                if sort:
                    cursor = cursor.sort(sort)
                return list(cursor)
            else:
                print("No collection selected. Use set_collection() first.")
                return []
        except PyMongoError as e:
            print(f"Error retrieving documents: {e}")
            return []

    def post(self, document):
        try:
            if self.collection is not None:
                print(type(document))
                print(f"Inserting document: {document}")
                print(f"Collection: {self.collection.name}")
                # Implement the logic to insert data
                if isinstance(document, dict):
                    result = self.collection.insert_one(document)
                elif isinstance(document, list):
                    result = self.collection.insert_many(document)
                else:
                    print("Invalid document type")
                    return None
                print(f"Inserted document with ID: {result.inserted_id}")
                return result
            else:
                print("No collection selected. Use set_collection() first.")
                return None  
        except PyMongoError as e:
            print(f"Error inserting document: {e}")
            return None          

    def delete(self, query):
        try:
            if self.collection is not None:
                return self.collection.delete_many(query)
            else:
                print("No collection selected. Use set_collection() first.")
                return None
        except PyMongoError as e:
            print(f"Error deleting documents: {e}")
            return None
        
    def put(self, filter_query, update_data, upsert=False):
        """
        Updates documents in the collection based on the provided criteria.

        :param filter_query: Dictionary specifying the criteria to select documents to update.
        :param update_data: Dictionary specifying the update operations to be applied to the documents.
        :param upsert: If True, a new document is inserted if no document matches the filter_query.
        :return: Result of the update operation.
        """
        if not self.collection is not None:
            raise ValueError("Collection not set.")

        # MongoDB requires update operations to be prefixed with operators like '$set', '$unset', etc.
        # Ensure update_data is structured properly or wrap it with '$set' if it's a direct field update.
        if not any(key.startswith("$") for key in update_data.keys()):
            update_data = {"$set": update_data}

        result = self.collection.update_many(filter_query, update_data, upsert=upsert)
        return result
    


if __name__ == "__main__":
    
    query = sys.argv[1]
    manager = MongoManager()
    manager.set_database("candy_store")
   # manager.set_collection("your_collection")

  
