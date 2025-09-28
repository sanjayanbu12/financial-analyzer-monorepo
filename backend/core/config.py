from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import Optional

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    pydantic-settings handles loading from the .env file automatically.
    """
    
    # Required API keys and database connection
    GEMINI_API_KEY: str
    SERPER_API_KEY: str
    MONGO_URI: str
    SECRET_KEY: str
    
    # JWT authentication configuration
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Optional API key for compatibility
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        # Environment file configuration
        env_file = ".env"

# Global settings instance
settings = Settings()