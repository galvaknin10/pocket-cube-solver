import os
from pocket_cube import Pocket_Cube
from built_tree import bfs_tree_build
from solve_cube import solve_user_cube
from data_base_connection import connect_to_mongo


def is_valid_cube_state(cube_state):
    """
    Validates the user-provided cube state string to ensure it meets the expected format.
    
    :param cube_state: str, the cube state representation (24 characters, 4 per face)
    :return: bool, True if valid, False otherwise
    """
    # Check if the length is exactly 24 (representing 6 faces, 4 letters each)
    if len(cube_state) != 24:
        return False
    
    # Valid colors in the Pocket Cube: W (white), Y (yellow), O (orange), R (red), G (green), B (blue)
    valid_colors = ['W', 'Y', 'O', 'R', 'G', 'B']

    # Ensure all characters in the cube state are valid colors
    for color in cube_state:
        if color not in valid_colors:
            return False
            
    return True


def main():
    """
    Main function to interact with the user and solve the Pocket Cube.
    The user can either input a specific cube state or generate a random one. 
    The function solves the cube by leveraging a pre-built BFS tree stored in MongoDB.
    """
    
    # Initialize a solved Pocket Cube to build the search tree if needed
    solved_cube = Pocket_Cube()
    TREE_BUILT_FLAG = 'tree_built.flag'

    # Check if the cube state tree has already been built
    if not os.path.exists(TREE_BUILT_FLAG):
        # If the tree hasn't been built, run the BFS tree-building phase
        print("Building the cube state tree. This may take some time (maybe 1 hour)...")
        bfs_tree_build(solved_cube)  # Build a BFS tree from the solved state
        
        # Create a flag file to indicate that the tree has been built
        with open(TREE_BUILT_FLAG, 'w') as flag_file:
            flag_file.write('Tree has been built.\n')
        print("Tree building completed!")

    # Create an index on the 'state' field in MongoDB for faster lookup during solving
    mongo_client, collection = connect_to_mongo("mongodb://localhost:27017/", 'pocket_cube_db', 'cube_tree')
    collection.create_index("state", unique=True)  # Ensure fast lookup with unique states
    mongo_client.close()

    # Ask the user whether they want to manually input the cube state or shuffle a random cube
    user_decision = input('For Manually Inputting Cube Press (M), For Automatic Cube Press (A): ').upper()
    user_cube = Pocket_Cube()
    
    if user_decision == 'M':
        # If manual input, ask the user to provide the cube state string
        cube_rep = input('Enter Your Cube State (4 letters per face: U(up), D(down), F(forward), B(back), L(left), R(right)): ')
        
        # Validate the cube state format until a valid input is provided
        while not is_valid_cube_state(cube_rep):
            print("Invalid input! Please ensure the cube state is exactly 24 characters long, "
                  "and only includes valid colors (W, Y, O, R, G, B).")
            cube_rep = input('Enter Your Cube State: ')
        
        # Update the cube with the provided state
        user_cube.update_faces_by_symmetry(cube_rep)
        
    else:
        # If automatic, shuffle the cube randomly
        user_cube.shuffle(50)  # Shuffle the cube 50 times for randomness
        print("A random cube state has been generated.")

    # Solve the user's cube using the pre-built tree and display the steps
    print("Solving the cube...")
    solve_user_cube(user_cube, solved_cube.hash_rep())


# Run the main function if this script is executed directly
if __name__ == '__main__':
    main()

