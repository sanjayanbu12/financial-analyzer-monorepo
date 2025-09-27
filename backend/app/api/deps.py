from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.schemas.token import TokenData
from app.services.user_service import UserService
from app.models.user import User
from app.db.database import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

async def get_db() -> AsyncIOMotorDatabase:
    return get_database()

async def get_current_user(
    db: AsyncIOMotorDatabase = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except (JWTError, ValidationError):
        raise credentials_exception
    
    user_service = UserService(db)
    user = await user_service.get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

