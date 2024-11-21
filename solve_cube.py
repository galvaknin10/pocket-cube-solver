def solve_user_cube(user_cube, solved_state, lookup_dict):
    """
    Finds the solution path from the user's current cube state to the solved state
    by backtracking through recorded states and actions in a preprocessed dictionary.

    Parameters:
        user_cube: The current cube object.
        solved_state (str): String representation of the solved cube state.
        lookup_dict (dict): Preprocessed dictionary containing cube states as keys.
                            Each key maps to a dictionary with 'state', 'action', and 'parent'.

    Returns:
        list: A solution path as a list of tuples, where each tuple contains:
              - The cube state (str) at a given step.
              - The action (str) taken to reach that state.
    """
    solution_path = []  # Initialize the solution path
    possible_rotations = user_cube.normalize_cube_by_symmetry()  # Generate all symmetrical cube states
    dictionary = None  # Initialize variable to hold the matching dictionary entry

    # Search for a matching normalized state in the lookup dictionary
    for rotation in possible_rotations:
        if rotation in lookup_dict:
            dictionary = lookup_dict[rotation]  # Found the matching state
            break

    # If no matching state is found, notify the user and exit
    if dictionary is None:
        return

    # Start backtracking from the current user state to the solved state
    user_cube = dictionary.get('state')  # Set the current state to the found match
    while user_cube != solved_state:
        # Retrieve the action and parent state for the current state
        action = dictionary.get('action')
        curr_parent = dictionary.get('parent')

        # Add the current state and action to the solution path
        solution_path.append((user_cube, action))

        # Move to the parent state for the next iteration
        user_cube = curr_parent

        # Find the dictionary entry for the parent state
        if user_cube in lookup_dict:
            dictionary = lookup_dict[user_cube]
        else:
            return

    # Add the solved state with a success message
    solution_path.append((solved_state, 'Congratulations!'))

    return solution_path











