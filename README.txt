Pocket Cube Solver


# Description:
The Pocket Cube Solver is a Python application that efficiently solves the 2x2 Rubik's Cube (Pocket Cube) using a Breadth-First Search (BFS) algorithm. It leverages a pre-built database of cube states for rapid solving, reducing the complexity of each solution search to O(1).


# File Overview:
main.py
The entry point for the application. Users can run this file via the command python -m main to interact with the Pocket Cube solver app.

pocket_cube.py
Contains the implementation of the Pocket Cube class, with methods for manipulating and solving the cube.

solve_cube.py
Contains the logic for solving the Pocket Cube. It uses the pre-built state database to find the optimal solution to any given cube configuration.

gui_module.py
Responsible for setting up the graphical user interface (GUI) for the Pocket Cube solver project using Tkinter. It creates a window that displays a 3D simulation of the Pocket Cube along with interactive buttons for shuffling the cube, manually entering a specific state, and accurate steps for solving the cube.

tree_data.zip
A compressed archive containing the preprocessed tree data in a ready-to-use format. Unzip this file to avoid building the tree from scratch.

README.txt
This file, which provides an overview and instructions for using the Pocket Cube solver.

pre_built/
This folder contains optional tools for users who wish to build the tree themselves:

built_tree.py: Implements the BFS algorithm to build the tree of all possible Pocket Cube states.
data_base_connection.py: Manages the connection between the solver and a MongoDB database for storing the cube state tree.
serialize_json.py: Converts the exported JSON file from MongoDB into a dictionary structure optimized for fast lookups during solving (notice the pkl file needs to be in the root folder).


# Installation Instructions:
1. Clone the repository (git clone https://github.com/gal10/pocket-cube-solver.git).
2. Unzip the tree_data.zip file in the project root to extract the preprocessed data.
3. In the console, type python -m main and press Enter to run the application.

For building the tree (optional):
*If you don't already have MongoDB, install it first. You can find instructions on MongoDB's official site. 
1. Validate parameters of connect_to_mongo function inside built_tree.py and start the building processes (this might take 2.5 hours).
2. When building completed, export data to JSON format.
3. Convert the JSON file with serialize_json.py program.
4. Run the application through console with python -m main.


# Algorithm and Complexity:
BFS Algorithm
The solver uses a Breadth-First Search (BFS) algorithm to find the shortest path to solve the Pocket Cube. During the BFS tree-building phase, all unique reachable cube states are explored and stored in a MongoDB database for fast retrieval. practically, we search for the specfic user cube inside the pre-built bfs tree, and then backtracking up to the root which is the solved state of the cube.

Time Complexity
BFS Tree Building: O(V + E) which V is the number of vertices and E is the number of edges between those vertices. In our context, V is the number of unique states and E is the total number of possible moves between these states. There are 3.6 millios of different states, so E would be 6 x 3.6M due to 6 possible action we can do on each state. So V + E is still linear relatively to the input size, but is indeed a very large number, therefore building phase takes 2.5 hours approximately.
Why 3.6 Million Unique Cube States?
The Pocket Cube has 8 corner pieces, and each corner piece has 3 possible orientations. The number of possible arrangements of the corner pieces is calculated using the following:
1. Permutations of the 8 corners(cubelets): The number of ways to arrange 8 distinct pieces is 8! (factorial of 8): 8! = 40,320.
2. Orientations of the corners: Each corner can be oriented in 3 possible ways (x, y and z axis), but the overall orientation must valid, so only 7 cubelets orientations are independent (since the 8th corner is fixed by the orientation of the others): 3^7 = 2,187.
3. Accounting for cube rotations: Since the cube can be rotated in 24 different ways without changing its relative state (due to symmetry, 6 faces can be on the top and for each face on top the cube can be rotated in 4 different ways, by rotating it around x_axis. Thus, the total number of symmetrical configurations is 6 x 4 = 24). 

So we divide the result by 24 to account for equivalent configurations: (8! x 3^7) / 24 = 3,674,160.
This is the exact number of documents in the database after the tree-building phase is completed.

Solution Search: If you were to solve a specific Pocket Cube state by building a new BFS tree each time (with that state as the root), the time complexity would be O(6^d), where:
6 represents the branching factor, corresponding to the 6 possible face rotations (6 actions in PocketCube class).
d is the depth of the shortest solution, which can reach up to 14 moves in the worst case.
The BFS algorithm explores all possible cube states layer by layer. Even though the branching factor is 6, the number of states grows exponentially as the depth increases, making this approach inefficient. In contrast, using a pre-built BFS tree allows O(1) time complexity by directly looking up the solution and backtracking to the solved state.
