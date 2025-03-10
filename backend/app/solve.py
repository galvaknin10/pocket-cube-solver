from backend.app.load_data import TREE_DATA
from pocket_cube import Pocket_Cube

def solve_cube(initial_state: str):
    """Finds the solution path by backtracking from the given state."""
    
    possible_rotations = Pocket_Cube.normalize_cube_by_symmetry()  # Generate all symmetrical cube states

    # Search for a matching normalized state in the lookup dictionary
    for rotation in possible_rotations:
        if rotation in TREE_DATA:
            current_document = TREE_DATA[rotation]  # Found the matching state
            break

    # If no matching state is found, notify the user and exit
    if current_document is None:
        return {"error": "State not found in the solution tree"}

    path = []
    while "parent" in current_document:
        current_cube_state = current_document.get("state")
        action_to_parent = current_document.get("action")
        path.append(current_cube_state, action_to_parent)

        # Move to the next document
        current_document = current_document.get("parent")
    
    # Add the solved state
    path.append(current_document.get("state"), "Congratulations!")

    return path  
