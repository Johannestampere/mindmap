from pydantic import BaseSettings, AnyUrl # "BaseSettings" knows how to read ".env" and "AnyUrl" validates the URL

# Configuration loaded from .env (environment variables)
class Settings(BaseSettings):
    DATABASE_URL: AnyUrl
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ORIGINS: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create settings object to be able to write "from app.core.config import settings" everywhere else
settings = Settings()
