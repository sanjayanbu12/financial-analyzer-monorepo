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
    # Required settings that must be in the .env file
    GEMINI_API_KEY: str
    SERPER_API_KEY: str
    MONGO_URI: str
    SECRET_KEY: str

    # Settings with default values
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Optional setting to satisfy the tool's dependency check
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        # Specifies which .env file to read from
        env_file = ".env"

# Instantiate the settings
settings = Settings()