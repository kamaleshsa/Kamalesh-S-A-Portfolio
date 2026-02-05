from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Supabase Configuration
    supabase_url: str
    supabase_key: str
    supabase_service_key: str

    # OpenAI Configuration - Support multiple keys
    openai_api_keys: str  # Comma-separated list of API keys

    # Email Configuration
    resend_api_key: str = ""
    contact_email: str = "kamaleshsa8300@gmail.com"

    # Application Configuration
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    environment: str = "development"

    # Rate Limiting
    rate_limit_enabled: bool = True
    contact_form_rate_limit: str = "3/hour"

    # AI Configuration
    ai_model: str = "mistral-small-latest"  # Mistral's free tier model
    ai_temperature: float = 0.7
    ai_max_tokens: int = 500

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

    def get_openai_keys(self) -> List[str]:
        """Parse comma-separated API keys."""
        return [key.strip() for key in self.openai_api_keys.split(",") if key.strip()]


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
