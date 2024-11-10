Pocket Cube Solver


# Description:
The Pocket Cube Solver is a Python application that efficiently solves the 2x2 Rubik's Cube (Pocket Cube) using a Breadth-First Search (BFS) algorithm. It leverages a pre-built database of cube states for rapid solving, reducing the complexity of each solution search to O(1).


# File Overview:
main.py
The entry point for the application. Users can run this file via the command python -m main to interact with the Pocket Cube solver in the console.

pocket_cube.py
Contains the implementation of the Pocket Cube class, with methods for manipulating and solving the cube.

solve_cube.py
Contains the logic for solving the Pocket Cube. It uses the pre-built state database to find the optimal solution to any given cube configuration.

tree_data.zip
A compressed archive containing the preprocessed tree data in a ready-to-use format. Unzip this file to avoid building the tree from scratch.

README.txt
This file, which provides an overview and instructions for using the Pocket Cube solver.

pre_built/
This folder contains optional tools for users who wish to build the tree themselves:

built_tree.py: Implements the BFS algorithm to build the tree of all possible Pocket Cube states.
data_base_connection.py: Manages the connection between the solver and a MongoDB database for storing the cube state tree.
serialize_json.py: Converts the exported JSON file from MongoDB into a dictionary structure optimized for fast lookups during solving.


# Installation Instructions:
1. Clone the repository (git clone https://github.com/gal10/pocket-cube-solver.git)
2. Unzip the tree_data.zip file in the project root to extract the preprocessed data.
3. In the console, type python -m main and press Enter to run the application.

For building the tree (optional):
*If you don't already have MongoDB, install it first. You can find instructions on MongoDB's official site. 
1. Validate parameters of connect_to_mongo function inside built_tree.py and start the building processes (this might take 2.5 hours).
2. When building completed, export data to JSON format.
3. Convert the JSON file into a dictionary where the keys represent the unique states of the cube.
4. Run the application through console with python -m main.


# Algorithm and Complexity:
BFS Algorithm
The solver uses a Breadth-First Search (BFS) algorithm to find the shortest path to solve the Pocket Cube. During the BFS tree-building phase, all unique reachable cube states are explored and stored in a MongoDB database for fast retrieval.

Time Complexity
BFS Tree Building: O(n), where n is the number of unique Pocket Cube states (around 3.6 million).
Why 3.6 Million Unique Cube States?
The Pocket Cube has 8 corner pieces, and each corner piece has 3 possible orientations. The number of possible arrangements of the corner pieces is calculated using the following:
1. Permutations of the 8 corners(cubelets): The number of ways to arrange 8 distinct pieces is 8! (factorial of 8): 8! = 40,320.
2. Orientations of the corners: Each corner can be oriented in 3 possible ways (x, y and z axis), but the overall orientation must valid, so only 7 cubelets orientations are independent (since the 8th corner is fixed by the orientation of the others): 3^7 = 2,187.
3. Accounting for cube rotations: Since the cube can be rotated in 24 different ways without changing its relative state (due to symmetry, 6 faces can be on the top and for each face on top the cube can be rotated in 4 different ways, by rotating it around x_axis. Thus, the total number of symmetrical configurations is 6 x 4 = 24). 

so we divide the result by 24 to account for equivalent configurations: (8! x 3^7) / 24 = 3,674,160.
This is the exact number of documents in the database after the tree-building phase is completed.

Solution Search: O(1), due to the pre-built dictionary structure that maps cube states to their solution paths.
This drastic reduction in complexity from O(n) to O(1) is achieved by storing the entire cube state tree in a MongoDB database and then converting it into a dictionary using serialize_json.py. Once the dictionary is built, the solver can quickly return the solution for any cube state in constant time.