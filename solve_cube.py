def solve_user_cube(user_cube, solved_state, lookup_dict):
    """
    Find the solution path from the user's current cube state to the solved state by backtracking 
    through the recorded states and actions in the database.

    Parameters:
    - user_cube: The current cube object.
    - solved_state: string representation of the solved state.
    - lookup_dict: The preprocessed dictionary with cube states as keys.

    Returns:
    - solution_path: A list of tuples, where each tuple contains the state and the action taken to reach it.
    
    Raises:
    - ValueError: If an invalid state is found or if backtracking fails.
    """

    solution_path = []
    possible_rotations = user_cube.normalize_cube_by_symmetry()
    dictionary = None  # Initialize dictionary as None outside the loop

    # Search for the matching rotation in the lookup dictionary
    for rotation in possible_rotations:
        if rotation in lookup_dict:
            dictionary = lookup_dict[rotation]  # Found the matching state dictionary
            break

    # If no match is found, return a message and end function
    if dictionary is None:
        print("Sorry", "Invalid cube state, no solution found\nTry again...")
        return 

    user_cube = dictionary.get('state') # Assigned current cube state

    # Backtrack from the current user state to the solved state using the recorded parent states and actions
    while user_cube != solved_state:
        action = dictionary.get('action')
        curr_parent = dictionary.get('parent')

        # Add the current state and the action to the solution path
        solution_path.append((user_cube, action))

        # Move to the parent state for the next iteration
        user_cube = curr_parent
        
        # Find the dictionary for the parent state using the lookup dictionary
        if user_cube in lookup_dict:
            dictionary = lookup_dict[user_cube]
        else:
            raise ValueError(f"Backtracking failed: Parent state for {user_cube} not found in the database.")

    # Append the solved state with a success message
    solution_path.append((solved_state, 'Congratulations!'))

    return solution_path











