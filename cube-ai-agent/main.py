# cube-ai-agent/main.py

from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "https://pocket-cube-backend-service.onrender.com"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Pydantic model for prompt input (currently not used, but in place for future use)
class Prompt(BaseModel):
    prompt: str = "Give me a fun fact about the Pocket Cube or Rubik's Cube."


# Basic health check route
@app.get("/")
def read_root():
    return {"message": "Pocket Cube Solver ai API is running"}

# Endpoint that returns a fun fact using Gemini API
@app.get("/fun-fact")
def get_fun_fact():
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {"parts": [{"text": "Give me a fun fact about the Pocket Cube or Rubik's Cube."}]}
        ]
    }

    # Send request to Gemini API
    res = requests.post(f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}", headers=headers, json=body)

    if res.status_code == 200:
        data = res.json()
        full_text = data["candidates"][0]["content"]["parts"][0]["text"]

        # Remove generic first line if present
        lines = full_text.strip().split("\n")
        if lines[0].lower().startswith("here's a fun fact"):
            lines = lines[1:]

        trimmed_fact = "\n".join(lines).strip()
        return {"fact": trimmed_fact}
    else:
        return {"error": res.text}
