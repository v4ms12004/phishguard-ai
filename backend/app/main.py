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
    allow_origins=["*"],
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
async def predict(request: EmailRequest, http_request: Request):
    text_parts = [
        request.subject or "",
        request.body or "",
        request.url or "",
    ]
    combined_text = "\n".join(text_parts)

    prob = predict_phishing_probability(combined_text)
    label = "phishing" if prob >= 0.5 else "legitimate"

    explanation = ["Stub model: probability based on text length only."]

    client_ip = http_request.client.host if http_request.client else None
    log_prediction(
        subject=request.subject,
        url=request.url,
        label=label,
        probability=prob,
        client_ip=client_ip,
    )

    return PredictionResponse(
        label=label,
        phishing_probability=prob,
        explanation=explanation,
    )
