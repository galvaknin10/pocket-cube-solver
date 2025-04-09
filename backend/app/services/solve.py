# solve.py — Handles solving a cube state by tracing back to the root state using precomputed tree data


# Mapping of compressed integer values back to standard cube move notations.
# These values are used when decoding actions from the preprocessed .pkl file
# so they can be sent to the frontend in a readable format.
INT_TO_ACTION = {
    0: "U",
    1: "D",
    2: "F",
    3: "B",
    4: "L",
    5: "R"
}

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
        layer = INT_TO_ACTION[action_to_parent]
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




    
