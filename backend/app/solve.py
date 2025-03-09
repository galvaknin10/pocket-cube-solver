from backend.app.load_data import TREE_DATA

def solve_cube(initial_state: str):
    """Finds the solution path by backtracking from the given state."""
    
    if initial_state not in TREE_DATA:
        return {"error": "State not found in the solution tree"}

    path = []
    current_state = TREE_DATA[initial_state]

    while "parent" in current_state:
        path.append(current_state["action"])
        current_state = TREE_DATA.get(current_state["parent"], None)
        if not current_state:
            break  # Stop if no parent found

    return {"solution_path": path[::-1]}  # Reverse to get steps from start to solved state
