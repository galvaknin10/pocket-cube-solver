# solve.py — Handles solving a cube state by tracing back to the root state using precomputed tree data

def solve_cube(curr_state: str, TREE_DATA: dict):
    """
    Finds the solution path for a given cube state by backtracking through TREE_DATA.

    Args:
        curr_state (str): The current scrambled cube state.

    Returns:
        dict: A dictionary with the solution path as a list of move labels,
              or None if the state is invalid.
    """
    document = TREE_DATA.get(curr_state)

    # Define the solved state of the cube (goal)
    soloution_state = "BBBBGGGGOOOORRRRWWWWYYYY"
    path = []

    # Backtrack from the current state to the solution root
    while curr_state != soloution_state:

        # Get the action that led to this state
        action_to_parent = document.get("action")

        # Convert backend action description into a readable layer name for the frontend
        layer = translate_action_to_layer(action_to_parent)
        path.append(layer)

        # Move to the parent node in the solution tree
        curr_state = document.get("parent")
        if curr_state in TREE_DATA:
            document = TREE_DATA.get(curr_state)
        else:
            # If the parent is missing, return None (likely invalid state)
            return

    path.append("Congratulations!")

    return { "solution": path }


def translate_action_to_layer(action):
    """
    Maps descriptive actions from the tree data to standard cube layer notation.

    Args:
        action (str): The string describing the move (e.g., "rotate_top").

    Returns:
        str: A single-character representing the layer (U, D, F, B, L, or R).
    """
    if "top" in action:
        return "U"
    elif "bottom" in action:
        return "D"
    elif "most" in action:
        return "F"
    elif "less" in action:
        return "B"
    elif "right" in action:
        return "L"
    else:
        return "R"

    
