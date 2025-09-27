from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    # This line adds the crucial length validation
    password: str = Field(..., min_length=8, max_length=72)

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str

    class Config:
        from_attributes = True