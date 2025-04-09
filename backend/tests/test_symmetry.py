from app.services import symmetry

# Mock data simulating a simplified tree of cube states
mock_tree_data = {
    "ABCDEF": {"action": "rotate_top", "parent": "ROOT"}
}

# Test when the input state exactly matches a key in the tree
def test_exact_match():
    result = symmetry.find_symmetric_state("ABCDEF", mock_tree_data)
    assert result["found"] is True
    assert result["state"] == "ABCDEF"
    assert "Exact match" in result["message"]

# Test when the input state has a symmetric variant that matches the tree
def test_symmetrical_match():
    class MockCube:
        def update_faces_by_symmetry(self, state):
            pass
        def normalize_cube_by_symmetry(self):
            return ["XYZ123", "ABCDEF", "QWE456"]  # Simulated symmetrical states

    # Patch Pocket_Cube with the mock
    symmetry.Pocket_Cube = MockCube

    result = symmetry.find_symmetric_state("NOT_IN_TREE", mock_tree_data)
    assert result["found"] is True
    assert result["state"] == "ABCDEF"
    assert "Symmetrical match" in result["message"]

# Test when no symmetric or exact match is found in the tree
def test_no_match():
    class MockCube:
        def update_faces_by_symmetry(self, state):
            pass
        def normalize_cube_by_symmetry(self):
            return ["NOPE1", "NOPE2"]  # No matches

    # Patch Pocket_Cube with the mock
    symmetry.Pocket_Cube = MockCube

    result = symmetry.find_symmetric_state("UNMATCHED_STATE", {})
    assert result["found"] is False
    assert result["state"] is None
    assert "No matching" in result["message"]
