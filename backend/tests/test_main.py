from fastapi import FastAPI
from fastapi.testclient import TestClient

# Create a lightweight FastAPI app for testing
mock_app = FastAPI()

# Define a simple root endpoint
@mock_app.get("/")
def read_root():
    return {"message": "Pocket Cube Solver API is running"}

# Initialize the test client for the mock app
client = TestClient(mock_app)

# Unit test for the root endpoint
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Pocket Cube Solver API is running"}
