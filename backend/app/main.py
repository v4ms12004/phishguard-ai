from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import EmailRequest, PredictionResponse
from app.services.model_loader import load_model, predict_phishing_probability
from app.services.logger import log_prediction

# ------------------------------------------
# 1. Create the app FIRST
# ------------------------------------------
app = FastAPI(title="PhishGuard AI", version="0.1.0")

# ------------------------------------------
# 2. Add middleware SECOND
# ------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later: ["https://your-frontend-domain.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------
# 3. Startup event
# ------------------------------------------
@app.on_event("startup")
async def startup_event():
    load_model()
    print("Model loaded (stub).")

# ------------------------------------------
# 4. Routes
# ------------------------------------------
@app.get("/")
async def root():
    return {"status": "ok", "message": "PhishGuard AI API running"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: EmailRequest):
    subject = (request.subject or "").strip()
    body = (request.body or "").strip()
    url = (request.url or "").strip()

    combined_text = " ".join(part for part in [subject, body, url] if part).strip()

    # ✅ If there is no content at all, don't run the model
    if not combined_text:
        return PredictionResponse(
            label="legitimate",
            phishing_probability=0.0,
            explanation=[
                "No subject, body, or URL were provided.",
                "The model was not run; phishing probability is reported as 0.0 by default."
            ],
        )

    prob = predict_phishing_probability(combined_text)

    label = "phishing" if prob >= 0.5 else "legitimate"

    explanation = [
        "Content-based model using TF-IDF features over subject, body, and URL.",
        "Higher risk for emails with phrases commonly seen in phishing (e.g., verify account, urgent action, password reset).",
    ]

    return PredictionResponse(
        label=label,
        phishing_probability=prob,
        explanation=explanation,
    )

