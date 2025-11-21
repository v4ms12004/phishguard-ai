# backend/app/services/model_loader.py

import io
import joblib
from typing import Dict, Any

# Import configuration and supabase client from app root
from app.config import MODELS_BUCKET_NAME, MODEL_STORAGE_PATH
from app.supabase_client import get_supabase_client

# Cache local model
_model_bundle: Dict[str, Any] | None = None


def load_model() -> Dict[str, Any]:
    """
    Load the ML model bundle from Supabase Storage.
    Expected format inside model.joblib:
        {"vectorizer": <TfidfVectorizer>, "model": <Classifier>}

    Falls back to dummy model if download fails.
    """
    global _model_bundle

    if _model_bundle is not None:
        return _model_bundle

    try:
        supabase = get_supabase_client()

        # Download model bytes from Supabase
        data = supabase.storage.from_(MODELS_BUCKET_NAME).download(
            MODEL_STORAGE_PATH
        )

        buffer = io.BytesIO(data)
        _model_bundle = joblib.load(buffer)

        print("✅ Model loaded from Supabase.")
        return _model_bundle

    except Exception as e:
        print("⚠️ MODEL LOAD FAILED. Using dummy model:", e)

        # fallback stub model
        _model_bundle = {"model": None, "vectorizer": None}
        return _model_bundle


def predict_phishing_probability(text: str) -> float:
    """
    Predict phishing probability.
    Falls back to a simple heuristic if real model is unavailable.
    """

    bundle = load_model()
    model = bundle.get("model")
    vectorizer = bundle.get("vectorizer")

    # 🔥 Fallback logic (stub model)
    if model is None or vectorizer is None:
        base = 0.3
        length_factor = min(len(text) / 1000, 0.6)
        return base + length_factor

    # Real prediction
    X = vectorizer.transform([text])
    prob = float(model.predict_proba(X)[0][1])
    return prob
