from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# Base user model with common fields
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

# User creation model with plain text password
class UserCreate(UserBase):
    password: str

# Database user model with hashed password for security
class UserInDB(UserBase):
    hashed_password: str

# JWT token response model
class Token(BaseModel):
    access_token: str
    token_type: str