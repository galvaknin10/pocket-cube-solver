from collections import deque
from data_base_connection import connect_to_mongo

def bfs_tree_build(solved_cube):
    """
    Performs a breadth-first search (BFS) to build a tree of cube states.
    Each state is saved in a MongoDB collection along with its parent state and the action taken to reach it.
    
    Parameters:
    - solved_cube: Cube object in it's solved state.

    The function explores the cube's state space level by level, applying all six possible actions to each state,
    and stores the resulting states in a MongoDB collection. Each transition from one state to another is also recorded.
    """

    # Establish connection to MongoDB and get references to the client and collection
    mongo_client, collection = connect_to_mongo("mongodb://localhost:27017/", 'pocket_cube_db', 'cube_tree')

    # Initialize the BFS queue with the solved cube state and track visited states to avoid revisiting
    solved_cube_rep = solved_cube.hash_rep()
    queue = deque([solved_cube])
    visited = set([solved_cube_rep])  # Set of visited states
    # Insert the solved state as the root of the tree in the database
    collection.insert_one({
        'state': solved_cube_rep,
        'parent': None,
        'action': None  # No action leads to the solved state
    })

    # Define a batch size for MongoDB inserts to reduce write operations
    BATCH_SIZE = 1000
    documents_to_insert = []  # List to accumulate documents for batch insertion

    # Variables for BFS level tracking
    level_num = 1  # Start at level 1 (after the solved state)
    level_size = 1  # Initial level contains only the solved state
    cubes_in_next_level = 0  # Number of states in the next BFS level

    print(f"Building the tree... Starting at level: {level_num}, with {level_size} node")

    while queue:
        # Reset the counter for the number of states in the next level
        cubes_in_next_level = 0

        # Process each cube in the current level
        for _ in range(level_size):
            current_cube = queue.popleft()
            current_cube_rep = current_cube.hash_rep()

            # Apply all six possible actions (rotations) to the current cube
            for action_num in range(1, 7):
                flag = 0  # Used to break early if a symmetrical state is found
                next_cube = current_cube.copy()  # Create a copy of the current cube for the action
                getattr(next_cube, f'action_{action_num}')()  # Apply the action (rotation)
                next_cube_rep = next_cube.hash_rep()

                # Check all symmetrical states of the resulting cube
                possible_rotations = next_cube.normalize_cube_by_symmetry()
                for rotation in possible_rotations:
                    if rotation in visited:  # Skip if any symmetrical state has already been visited
                        flag = 1
                        break

                if flag == 1:
                    continue

                next_cube.update_faces_by_symmetry(next_cube_rep)

                # Mark the cube state as visited and add it to the BFS queue
                visited.add(next_cube_rep)
                queue.append(next_cube)
                cubes_in_next_level += 1  # Increment the counter for the next level

                # Prepare the document to insert into MongoDB
                document = {
                    "state": next_cube_rep,
                    "parent": current_cube_rep,  # Reference the parent state
                    "action": f'{next_cube.which_action(action_num)} (counterclockwise)'  # Describe the action
                }
                documents_to_insert.append(document)

            # Perform batch insertion when the accumulated documents reach the BATCH_SIZE
            if len(documents_to_insert) >= BATCH_SIZE:
                collection.insert_many(documents_to_insert)
                documents_to_insert.clear()  # Clear the list after insertion

        # Move to the next level in the BFS tree
        level_size = cubes_in_next_level  # Set the size of the next level
        if level_size > 0:
            level_num += 1
            print(f"Status: level {level_num}, with {level_size} nodes")

    # Insert any remaining documents that didn't reach the batch size
    if documents_to_insert:
        collection.insert_many(documents_to_insert)

    # Close the MongoDB connection after completing the tree building
    mongo_client.close()
    print(f"Tree building completed. Total levels explored: {level_num}")







