# app/config.py
import os
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    """Simple app configuration"""
    
    # Environment
    environment: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    mongo_uri: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name: str = os.getenv("DATABASE_NAME", "campus_connect")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key-12345")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API
    api_title: str = "Campus Connect"
    api_version: str = "1.0.0"
    cors_origins: list[str] = ["*"]
    
    # Intent
    intent_expiration_hours: int = 48
    min_compatibility_score: int = 50
    
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # THIS LINE - allows extra fields from .env
    )

settings = Settings()