from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Financial Document Analyzer"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    # Database
    MONGO_DETAILS: str
    DB_NAME: str

    # Celery
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str

    # LLM
    GOOGLE_API_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()

