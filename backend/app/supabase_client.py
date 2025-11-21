# backend/app/supabase_client.py

from supabase import create_client, Client
from app.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

_supabase_client: Client | None = None

def get_supabase_client() -> Client:
    """
    Returns a singleton Supabase client.
    """
    global _supabase_client

    if _supabase_client is None:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise RuntimeError("Supabase URL or Service Key is not set in environment variables!")

        _supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        print("✅ Supabase client initialized")

    return _supabase_client
