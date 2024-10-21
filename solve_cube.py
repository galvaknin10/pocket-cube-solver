from data_base_connection import connect_to_mongo
from pocket_cube import Pocket_Cube

def solve_user_cube(user_cube, solved_state):
    """
    Solves the user's cube by querying a pre-built tree of cube states from MongoDB.
    It backtracks from the user's current state to the solved state by following the recorded transitions
    in the database, and returns a list of steps (actions) to solve the cube.
    
    Parameters:
    - user_cube: The current cube state provided by the user. It must be a state that can be transformed into the 
                 solved state, and in a format comparable to the 'state' entries in the MongoDB collection.
    - solved_state: The solved cube state. This is used to verify when the solution process has reached the goal.
    
    Returns:
    - solution_path: A list of steps that describe the path from the user's cube state to the solved state. 
                     Each step includes the current cube state and the action performed to reach it.
    """

    # Connect to MongoDB and get references to the client and the collection storing the cube state tree
    mongo_client, collection = connect_to_mongo("mongodb://localhost:27017/", 'pocket_cube_db', 'cube_tree')

    # Initialize an empty list to store the solution path (each step from user_cube to solved_state)
    solution_path = []

    # Check all possible symmetrical configurations of the user's cube to find a matching state in the database
    possible_rotations = user_cube.normalize_cube_by_symmetry()
    for rotation in possible_rotations:
        document = collection.find_one({"state": rotation})
        if document:
            break  # Stop if a matching cube state is found in the database

    # If no match is found, the state is not in the database, so no solution can be provided
    if document is None:
        print("State not found in the database, no solution found for the given cube state.")
        return

    # Set the user's cube to the matching state found in the database
    user_cube = document['state']
    print(user_cube)  # Debug print to display the user's state (optional)

    # Backtrack from the current user state to the solved state using the recorded parent states and actions
    while user_cube != solved_state:
        # Extract the action taken to reach the current state and its parent state from the document
        action = document['action']
        curr_cube_state = document['state']
        curr_parent = document['parent']
      

        # Add the current state and the action taken to the solution path
        solution_path.append(f"(Notice the state of the cube - first 4 letters are the up face, and so on...)\n {curr_cube_state} -> {action} -> {curr_parent}")

        # Move to the parent state for the next iteration
        user_cube = curr_parent
        document = collection.find_one({"state": user_cube})


    # Close the MongoDB connection when the solution process is complete
    mongo_client.close()

    # Display each step in the solution path to the user
    step_num = 1  # Start counting steps from 1
    for step in solution_path:
        print(f'Step {step_num}:')
        print(step)  # Display the current step
        print('\n\n')  # Separate each step with double newlines
        step_num += 1  # Increment step count

    # Display a final message indicating the cube is solved
    print(f'{user_cube} -> Solved!')









