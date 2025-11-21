# backend/train_model.py

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score
import joblib

from supabase import create_client
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

BUCKET_NAME = "models"
MODEL_STORAGE_PATH = "phishguard/model.joblib"  # must match config.py


def get_supabase_client():
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def build_text(row):
    """Combine subject, body, and url into a single text field."""
    parts = []
    if isinstance(row.get("subject"), str):
        parts.append(row["subject"])
    if isinstance(row.get("body"), str):
        parts.append(row["body"])
    if isinstance(row.get("url"), str):
        parts.append(row["url"])
    return " ".join(parts)


def main():
    # 1. Load dataset
    df = pd.read_csv("emails.csv")  # expects columns: subject, body, url, label

    # Handle both old (text,label) and new (subject,body,url,label) formats gracefully
    if "text" in df.columns and "label" in df.columns and "subject" not in df.columns:
        df["combined_text"] = df["text"].astype(str)
    else:
        df["combined_text"] = df.apply(build_text, axis=1)

    if "label" not in df.columns:
        raise ValueError("Dataset must contain a 'label' column (1=phishing, 0=legit).")

    print("Loaded dataset:")
    print(df.head()[["combined_text", "label"]])

    X = df["combined_text"]
    y = df["label"].astype(int)

    # 2. Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. TF-IDF vectorizer (richer than before)
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),        # unigrams + bigrams
        max_features=10000,        # more vocabulary
        min_df=2,                  # ignore extremely rare noise
        stop_words="english",
    )

    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # 4. Classifier (Logistic Regression with stronger regularization)
    clf = LogisticRegression(
        max_iter=2000,
        C=1.0,
        class_weight="balanced",   # handle class imbalance
        n_jobs=-1,
    )
    clf.fit(X_train_vec, y_train)

    # 5. Evaluation
    y_pred = clf.predict(X_test_vec)
    y_prob = clf.predict_proba(X_test_vec)[:, 1]

    print("\nClassification report:")
    print(classification_report(y_test, y_pred, digits=3))

    try:
        print("ROC AUC:", roc_auc_score(y_test, y_prob))
    except Exception as e:
        print("Could not compute ROC AUC:", e)

    # 6. Save model bundle locally
    bundle = {"vectorizer": vectorizer, "model": clf}
    local_path = "model_v2.joblib"
    joblib.dump(bundle, local_path)
    print(f"\n✅ Saved trained model bundle to {local_path}")

    # 7. Upload to Supabase, overwriting previous model
    supabase = get_supabase_client()
    with open(local_path, "rb") as f:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=MODEL_STORAGE_PATH,
            file=f,
            file_options={"cache-control": "3600", "upsert": "true"},
        )

    print(f"✅ Uploaded v2 model to Supabase at {BUCKET_NAME}/{MODEL_STORAGE_PATH}")


if __name__ == "__main__":
    main()
