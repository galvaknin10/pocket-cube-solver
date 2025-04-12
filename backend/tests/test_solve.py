from unittest.mock import patch
from app.services.solve import solve_cube

# Simulate how get_document would return documents in reverse from state3 → root
mock_documents = {
    "state3": {"action": 4, "parent": "state2"},
    "state2": {"action": 2, "parent": "state1"},
    "state1": {"action": 0, "parent": "BBBBGGGGOOOORRRRWWWWYYYY"},
    "BBBBGGGGOOOORRRRWWWWYYYY": {"action": None, "parent": None},
}


def mock_get_document(state):
    return mock_documents.get(state)

@patch("app.services.solve.get_document", side_effect=mock_get_document)
def test_solve_cube_returns_correct_path(mock_get):
    result = solve_cube("state3")
    assert result == {"solution": ["L", "F", "U", "Congratulations!"]}