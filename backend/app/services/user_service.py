from app.core.security import get_password_hash, verify_password
from app.schemas.user import UserCreate
from app.models.user import User
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class UserService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = self.db.get_collection("users")

    async def get_user_by_email(self, email: str) -> User | None:
        user_data = await self.collection.find_one({"email": email})
        if user_data:
            user_data["_id"] = str(user_data["_id"])
            return User(**user_data)
        return None

    async def create_user(self, user_in: UserCreate) -> User:
        hashed_password = get_password_hash(user_in.password)
        user_dict = user_in.model_dump()
        user_dict.pop("password")
        user_dict["hashed_password"] = hashed_password
        
        result = await self.collection.insert_one(user_dict)
        created_user = await self.collection.find_one({"_id": result.inserted_id})
        created_user["_id"] = str(created_user["_id"])
        return User(**created_user)
