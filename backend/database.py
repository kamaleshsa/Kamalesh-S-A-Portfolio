from supabase import create_client, Client
from config import get_settings

settings = get_settings()

# Initialize Supabase client
supabase: Client = create_client(settings.supabase_url, settings.supabase_service_key)


def get_supabase_client() -> Client:
    """Get Supabase client instance."""
    return supabase
