from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from core.security import create_access_token, verify_password, get_password_hash
from models.user import UserCreate, UserInDB, Token, UserBase
from db.database import get_database

router = APIRouter()

@router.post("/register", response_model=UserBase)
async def register_user(user: UserCreate, db = Depends(get_database)):
    """
    Handles user registration. Hashes the password and saves the new user to the database.
    """
    # Check for existing username to prevent duplicates
    existing_user = await db["users"].find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    
    # Hash password for secure storage
    hashed_password = get_password_hash(user.password)
    
    # Create database user model with hashed password
    user_data = user.dict(exclude={'password'})
    user_in_db = UserInDB(**user_data, hashed_password=hashed_password)
    
    # Save user to database
    await db["users"].insert_one(user_in_db.dict())
    
    return user_in_db

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db = Depends(get_database)
):
    """
    Provides a JWT token for valid user credentials.
    """
    # Authenticate user credentials
    user = await db["users"].find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT access token
    access_token = create_access_token(
        data={"sub": user["username"]}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}