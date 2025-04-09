# cube-ai-agent/main.py
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"



class Prompt(BaseModel):
    prompt: str = "Give me a fun fact about the Pocket Cube or Rubik's Cube."

@app.get("/fun-fact")
def get_fun_fact():
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {"parts": [{"text": "Give me a fun fact about the Pocket Cube or Rubik's Cube."}]}
        ]
    }
    res = requests.post(f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}", headers=headers, json=body)

    if res.status_code == 200:
        data = res.json()
        full_text = data["candidates"][0]["content"]["parts"][0]["text"]
        # Lines cleanup logic
        lines = full_text.strip().split("\n")
        if lines[0].lower().startswith("here's a fun fact"):
            lines = lines[1:]

        trimmed_fact = "\n".join(lines).strip()
        return {"fact": trimmed_fact}
    else:
        return {"error": res.text}
    