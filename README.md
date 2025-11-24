# PhishGuard AI — Intelligent Phishing Email Detection

PhishGuard AI is a full-stack AI cybersecurity web application that detects phishing emails using machine learning, natural language processing, and URL analysis.

## Live Demo

Frontend (Vercel):  
https://phishguard-ai-nv.vercel.app/ 

Backend API (Render):  
https://phishguard-backend-t1rc.onrender.com

## Features

- AI-powered phishing email detection
- Modern UX/UI with glassmorphism and neon effects
- Real-time classification + probability score
- Cloud-based backend (FastAPI on Render)
- Cloud database + storage (Supabase)
- Production-grade deployment

## ML Model

- TF-IDF Vectorizer
- Logistic Regression classifier
- Stored in Supabase Storage as model.joblib

## Tech Stack

### Frontend
- React + Vite
- Axios
- Custom CSS

### Backend
- FastAPI
- Uvicorn
- Pydantic
- Joblib, Scikit-Learn

### Infrastructure
- Supabase (Database + Storage)
- Render (Backend)
- Vercel (Frontend)

## Installation

### Backend
```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Frontend
```
VITE_API_BASE_URL=https://phishguard-backend-t1rc.onrender.com
```

## Deployment

### Backend (Render)
- Root Directory: backend
- Build: pip install -r requirements.txt
- Start: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT

### Frontend (Vercel)
- Root Directory: frontend
- Build: npm run build
- Output: dist

