# backend/app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

# Supabase project URL + service role key
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Bucket + model path (these MUST match Supabase!)
MODELS_BUCKET_NAME = "models"
MODEL_STORAGE_PATH = "phishguard/model.joblib"

# Optional: print to confirm loaded
print("Loaded config:")
print("SUPABASE_URL =", SUPABASE_URL)
print("MODELS_BUCKET_NAME =", MODELS_BUCKET_NAME)
print("MODEL_STORAGE_PATH =", MODEL_STORAGE_PATH)