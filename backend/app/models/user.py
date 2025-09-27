from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr = Field(...)
    full_name: str = Field(...)
    hashed_password: str = Field(...)
