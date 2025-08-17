# app/core/config.py

"""
Handles configuration loading using Pydantic.
Reads values from `.env` file (or system env).
This makes settings reusable and testable.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Modular Backend"
    DATABASE_URL: str | None = None  # Postgres DB connection string
    SECRET_KEY: str | None = None  # Used for JWT token signing
    ALGORITHM: str | None = None
    GEMINI_API_KEY: str | None = None  # OpenRouter API key
    ACCESS_TOKEN_EXPIRE_MINUTES: float = 600
    PYTHON_VERSION: str = "3.11.2"

    FRONTEND_URL: str | None = None

    class Config:
        env_file = ".env"  # Tells Pydantic to load from .env file
        env_file_encoding = "utf-8"


# Cached singleton config instance (so it's not re-parsed each time)
@lru_cache
def get_settings() -> Settings:
    return Settings()
