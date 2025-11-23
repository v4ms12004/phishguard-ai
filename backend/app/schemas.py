from pydantic import BaseModel
from typing import Optional, List

class EmailRequest(BaseModel):
    subject: Optional[str] = ""
    body: Optional[str] = ""
    url: Optional[str] = ""
    user_id: Optional[str] = None  # 👈 add this

class PredictionResponse(BaseModel):
    label: str
    phishing_probability: float
    explanation: Optional[List[str]] = None
