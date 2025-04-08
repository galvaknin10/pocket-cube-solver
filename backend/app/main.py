# main.py — Entry point for the FastAPI backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router  # Importing the API routes

# Create the main FastAPI app instance
app = FastAPI(
    title="Pocket Cube Solver API",
    version="1.0.0",
    description="Backend service for solving 2x2x2 Pocket Cube states"
)

# Enable CORS for frontend (e.g., React running on localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],                   
    allow_headers=["*"],                  
)

# Register all API routes from the router module
app.include_router(router)

# Basic health check route
@app.get("/")
def read_root():
    return {"message": "Pocket Cube Solver API is running"}
