import mongomock
import pytest
import app.services.mongo_client as mongo_client
from app.services.mongo_client import get_document

# Override the collection in your module with a mocked one
@pytest.fixture(autouse=True)
def mock_mongo(monkeypatch):
    mock_client = mongomock.MongoClient()
    mock_db = mock_client["pocket_cube_db"]
    mock_collection = mock_db["cube_tree"]
    
    # Insert a mock document
    mock_state = "test_state_123"
    mock_parent = "test_parent_123"
    mock_action = "test_action_123"
    mock_doc = { "state": mock_state, "parent": mock_parent, "action": mock_action}
    mock_collection.insert_one(mock_doc)

    # Monkeypatch the real collection with the mock
    monkeypatch.setattr(mongo_client, "collection", mock_collection)

    return mock_state

def test_get_document_returns_correct_doc(mock_mongo):
    doc = get_document(mock_mongo)
    assert doc is not None
    assert doc["state"] == mock_mongo
    assert "parent" in doc
    assert "action" in doc
