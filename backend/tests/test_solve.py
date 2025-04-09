from app.services.solve import solve_cube, translate_action_to_layer

# Mock tree representing cube states and their parent actions
mock_tree_data = {
    "state3": {"action": "rotate_right", "parent": "state2"},
    "state2": {"action": "rotate_most", "parent": "state1"},
    "state1": {"action": "rotate_top", "parent": "BBBBGGGGOOOORRRRWWWWYYYY"},
    "BBBBGGGGOOOORRRRWWWWYYYY": {},  # Solved state (root)
}

# Test that solve_cube returns the correct path of moves ending with "Congratulations!"
def test_solve_cube_returns_correct_path():
    result = solve_cube("state3", mock_tree_data)
    print(result)
    assert result == {"solution": ["L", "F", "U", "Congratulations!"]}

# Test action-to-layer mapping logic
def test_translate_action_to_layer():
    assert translate_action_to_layer("rotate_top") == "U"
    assert translate_action_to_layer("rotate_bottom") == "D"
    assert translate_action_to_layer("rotate_most") == "F"
    assert translate_action_to_layer("rotate_less") == "B"
    assert translate_action_to_layer("rotate_right") == "L"
    assert translate_action_to_layer("rotate_left") == "R"
