import pytest
from app.services.solve import solve_cube, translate_action_to_layer

# 🧪 Mock TREE_DATA for testing
mock_tree_data = {
    "state3": {"action": "rotate_right", "parent": "state2"},
    "state2": {"action": "rotate_most", "parent": "state1"},
    "state1": {"action": "rotate_top", "parent": "BBBBGGGGOOOORRRRWWWWYYYY"},
    "BBBBGGGGOOOORRRRWWWWYYYY": {},  # solved state
}

def test_solve_cube_returns_correct_path(monkeypatch):
    # Monkeypatch TREE_DATA
    from app.services import load_data
    monkeypatch.setattr(load_data, "TREE_DATA", mock_tree_data)

    result = solve_cube("state3")

    assert result == {"solution": ["R", "F", "U", "Congratulations!"]}

def test_translate_action_to_layer():
    assert translate_action_to_layer("rotate_top") == "U"
    assert translate_action_to_layer("rotate_bottom") == "D"
    assert translate_action_to_layer("rotate_most") == "F"
    assert translate_action_to_layer("rotate_less") == "B"
    assert translate_action_to_layer("rotate_right") == "L"
    assert translate_action_to_layer("rotate_unknown") == "R"
