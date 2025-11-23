from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import EmailRequest, PredictionResponse
from .services.model_loader import predict_phishing_probability
from .services.logger import log_scan

# Create FastAPI app
app = FastAPI()

# CORS settings – adjust Vercel URL if needed
origins = [
    "http://localhost:5173",
    "https://phishguard-ai.vercel.app",  # <-- put your actual frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: EmailRequest):
    # Clean fields
    subject = (request.subject or "").strip()
    body = (request.body or "").strip()
    url = (request.url or "").strip()
    user_id = request.user_id  # may be None

    # Combine text for the model
    combined_text = " ".join(part for part in [subject, body, url] if part).strip()

    # If no content, don't run the model
    if not combined_text:
        return PredictionResponse(
            label="legitimate",
            phishing_probability=0.0,
            explanation=[
                "No subject, body, or URL were provided.",
                "The model was not run; phishing probability is reported as 0.0 by default.",
            ],
        )

    # Run model prediction
    prob = predict_phishing_probability(combined_text)
    label = "phishing" if prob >= 0.5 else "legitimate"

    explanation = [
        "Content-based model using TF-IDF features over subject, body, and URL.",
        "Higher risk for emails with phrases commonly seen in phishing (e.g., verify account, urgent action, password reset).",
    ]

    # Log scan to Supabase (non-blocking in terms of UX)
    log_scan(
        user_id=user_id,
        subject=subject,
        body=body,
        url=url,
        label=label,
        probability=prob,
    )

    return PredictionResponse(
        label=label,
        phishing_probability=prob,
        explanation=explanation,
    )
