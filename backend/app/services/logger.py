from datetime import datetime
from typing import Optional
from ..supabase_client import get_supabase_client

def log_scan(
    user_id: Optional[str],
    subject: str,
    body: str,
    url: str,
    label: str,
    probability: float,
):
    try:
        supabase = get_supabase_client()
        payload = {
            "user_id": user_id,
            "subject": subject,
            "body": body,
            "url": url,
            "label": label,
            "probability": probability,
            "created_at": datetime.utcnow().isoformat() + "Z",
        }
        supabase.table("scans").insert(payload).execute()
    except Exception as e:
        # Don't crash on logging failure
        print(f"[log_scan] Failed to insert scan: {e}")
