# backend/app/services/logger.py

from app.supabase_client import get_supabase_client

def log_prediction(subject: str | None,
                   url: str | None,
                   label: str,
                   probability: float,
                   client_ip: str | None = None):
    """
    Logs a prediction event into the Supabase 'predictions' table.

    This function is intentionally error-safe:
    - If the table doesn't exist, it won't crash the backend.
    - If Supabase is unreachable, it prints an error but continues running.

    Expected Supabase table structure:
        predictions (
            id uuid default uuid_generate_v4(),
            created_at timestamptz default now(),
            subject text,
            url text,
            label text,
            probability float8,
            client_ip text
        )
    """
    try:
        supabase = get_supabase_client()

        supabase.table("predictions").insert({
            "subject": subject or "",
            "url": url or "",
            "label": label,
            "probability": probability,
            "client_ip": client_ip or "",
        }).execute()

        # Optional: debug print
        print("📌 Logged prediction to Supabase.")

    except Exception as e:
        # Prevent logging errors from crashing API
        print("⚠️ Failed to log prediction to Supabase:", e)
