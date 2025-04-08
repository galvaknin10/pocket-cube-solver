# cube-ai-agent/main.py
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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
        return {"fact": data["candidates"][0]["content"]["parts"][0]["text"]}
    else:
        return {"error": res.text}
    