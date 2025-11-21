from pydantic import BaseModel

class EmailRequest(BaseModel):
    subject: str | None = ""
    body: str
    url: str | None = ""

class PredictionResponse(BaseModel):
    label: str
    phishing_probability: float
    explanation: list[str]
