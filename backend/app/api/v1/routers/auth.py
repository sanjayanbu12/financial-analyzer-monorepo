from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import create_access_token, verify_password
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.services.user_service import UserService
from app.api.deps import get_db, get_current_user
from app.models.user import User

auth_router = APIRouter()

@auth_router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    user_service = UserService(db)
    user = await user_service.get_user_by_email(email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    new_user = await user_service.create_user(user_in=user_in)
    return UserResponse.model_validate(new_user)

@auth_router.post("/auth/token", response_model=Token)
async def login_for_access_token(
    db: AsyncIOMotorDatabase = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user_service = UserService(db)
    user = await user_service.get_user_by_email(email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

