from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None
    fs: AsyncIOMotorGridFSBucket = None

db_manager = Database()

async def connect_to_mongo():
    print("Connecting to MongoDB...")
    db_manager.client = AsyncIOMotorClient(settings.MONGO_DETAILS)
    db_manager.db = db_manager.client[settings.DB_NAME]
    db_manager.fs = AsyncIOMotorGridFSBucket(db_manager.db)
    print("Connected to MongoDB.")

async def close_mongo_connection():
    print("Closing MongoDB connection.")
    db_manager.client.close()
    print("MongoDB connection closed.")

def get_database():
    if db_manager.db is None:
        raise Exception("Database not initialized. Call connect_to_mongo first.")
    return db_manager.db

def get_gridfs_bucket():
    if db_manager.fs is None:
        raise Exception("GridFS not initialized. Call connect_to_mongo first.")
    return db_manager.fs

