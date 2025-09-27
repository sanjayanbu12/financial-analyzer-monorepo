from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

client: AsyncIOMotorClient = None

async def connect_to_mongo():
    """Establishes connection to the MongoDB database."""
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)
    print("Successfully connected to MongoDB.")

async def close_mongo_connection():
    """Closes the MongoDB connection."""
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")

async def get_database():
    """Returns the database instance."""
    if client is None:
        await connect_to_mongo()
    # The database name can be extracted from the URI or set explicitly
    # Assuming the database name is part of the MONGO_URI
    return client.get_default_database(default="financial_analyzer")
