from fastapi import FastAPI
from backend.app.routes import router

app = FastAPI()

# Include API routes
app.include_router(router)

# Root endpoint (optional)
@app.get("/")
def read_root():
    return {"message": "Pocket Cube Solver API is running"}
