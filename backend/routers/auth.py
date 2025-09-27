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
    # Check if user already exists
    existing_user = await db["users"].find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    
    hashed_password = get_password_hash(user.password)
    
    # --- THIS IS THE CORRECTED PART ---
    # Create a dictionary from the user data, excluding the plain password
    user_data = user.dict(exclude={'password'})
    
    # Create the database model instance with the hashed password
    user_in_db = UserInDB(**user_data, hashed_password=hashed_password)
    # ------------------------------------
    
    await db["users"].insert_one(user_in_db.dict())
    
    # Return the new user object (FastAPI will handle filtering out the hashed_password)
    return user_in_db

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_database)):
    """
    Provides a JWT token for valid user credentials.
    """
    user = await db["users"].find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user["username"]}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}