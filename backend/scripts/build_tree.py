from collections import deque
from db_connection import connect_to_mongo

def bfs_tree_build(solved_cube):
    """
    Builds a tree of cube states using breadth-first search (BFS) and stores the results in a MongoDB collection.

    The tree explores the cube's state space, applying all six possible actions to each state. Each state,
    its parent state, and the action taken to reach it are recorded in the MongoDB collection. Symmetrical
    states are normalized to avoid duplication.

    Parameters:
        solved_cube: Cube object in its solved state.

    Notes:
        - The MongoDB collection is used to store the states to allow efficient querying and persistent storage.
        - BFS ensures the shortest path to each state is recorded.

    Returns:
        None
    """
    # Establish connection to MongoDB and retrieve the collection reference
    mongo_client, collection = connect_to_mongo(
        "mongodb://localhost:27017/", 
        'pocket_cube_db', 
        'cube_tree'
    )

    # Initialize BFS queue and visited states
    solved_cube_rep = solved_cube.hash_rep()  # String representation of the solved state
    queue = deque([solved_cube])  # BFS queue starts with the solved cube
    visited = set([solved_cube_rep])  # Set to track visited states

    # Insert the solved state as the root of the tree in the database
    collection.insert_one({
        'state': solved_cube_rep,
        'parent': None,
        'action': None  # The solved state has no parent or action
    })

    # MongoDB batch insertion configuration
    BATCH_SIZE = 1000
    documents_to_insert = []

    # BFS level tracking
    level_num = 1
    level_size = 1  # Current level starts with only the solved state
    cubes_in_next_level = 0  # Number of nodes in the next level

    print(f"Building the tree... Starting at level: {level_num}, with {level_size} node")

    while queue:
        cubes_in_next_level = 0  # Reset next level counter

        # Process all nodes in the current level
        for _ in range(level_size):
            current_cube = queue.popleft()  # Dequeue the current cube
            current_cube_rep = current_cube.hash_rep()  # Get its hash representation

            # Apply all six actions (rotations)
            for action_num in range(1, 7):
                next_cube = current_cube.copy()  # Copy the current cube
                getattr(next_cube, f'action_{action_num}')()  # Apply the action
                next_cube_rep = next_cube.hash_rep()  # Get the hash of the new state

                # Check all symmetrical states to avoid duplicates
                if any(rotation in visited for rotation in next_cube.normalize_cube_by_symmetry()):
                    continue  # Skip if any symmetrical state is already visited
                next_cube.update_faces_by_symmetry(next_cube_rep) # Restore the cube to the unique state before the symmertical rotations

                # Mark the state as visited and enqueue the new cube
                visited.add(next_cube_rep)
                queue.append(next_cube)
                cubes_in_next_level += 1

                # Prepare a document for MongoDB
                document = {
                    "state": next_cube_rep,
                    "parent": current_cube_rep,
                    "action": f'{next_cube.which_action(action_num)} (counterclockwise)'
                }
                documents_to_insert.append(document)

            # Batch insert documents into MongoDB
            if len(documents_to_insert) >= BATCH_SIZE:
                collection.insert_many(documents_to_insert)
                documents_to_insert.clear()

        # Update level information
        level_size = cubes_in_next_level
        if level_size > 0:
            level_num += 1
            print(f"Status: level {level_num}, with {level_size} nodes")

    # Insert any remaining documents
    if documents_to_insert:
        collection.insert_many(documents_to_insert)

    # Close the MongoDB connection
    mongo_client.close()
    print(f"Tree building completed. Total levels explored: {level_num}")


