# cube-ai-agent/tests/test_main.py
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

# Initialize test client with the actual FastAPI app
client = TestClient(app)

# Mocked response from the Gemini API
def mock_gemini_response(*args, **kwargs):
    class MockResponse:
        def __init__(self):
            self.status_code = 200
            self._json = {
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": "Here's a fun fact:\nThe Pocket Cube has 3,674,160 possible positions!"
                        }]
                    }
                }]
            }

        def json(self):
            return self._json

    return MockResponse()

# Test the /fun-fact endpoint using a patched Gemini API response
@patch("main.requests.post", side_effect=mock_gemini_response)
def test_get_fun_fact(mock_post):
    response = client.get("/fun-fact")
    assert response.status_code == 200
    assert "fact" in response.json()
    assert "Pocket Cube" in response.json()["fact"]
