# Pocket Cube Solver
This repository provides a complete solution for solving the Pocket Cube using a pre-built database of cube states and a Breadth-First Search (BFS) algorithm to find the shortest solution path.

# File Overview:
- main.py
The entry point for the application. Users can run this file via the command python -m main to interact with the Pocket Cube solver in the console.

- pocket_cube.py
Contains the implementation of the Pocket Cube class, with methods for manipulating and solving the cube.

- solve_cube.py
Contains the logic for solving the Pocket Cube. It uses the pre-built state database to find the optimal solution to any given cube configuration.

- tree_data.zip
A compressed archive containing the preprocessed tree data in a JSON format. 
The JSON contains an array of cube state documents. unzip this file to avoid building the tree from scratch.

- gui_module.py
Responsible for setting up the graphical user interface (GUI) for the Pocket Cube solver project using Tkinter. It creates a window that displays a 3D simulation of the Pocket Cube along with interactive buttons for shuffling the cube, manually entering a specific state, and accurate steps for solving the cube.

- README.txt
This file, which provides an overview and instructions for using the Pocket Cube solver.

* pre_built/
This folder contains optional tools for users who wish to build the tree themselves:
- built_tree.py: Implements the BFS algorithm to build the tree of all possible Pocket Cube states. 
Additionally, Stores the tree dynamically as documents for efficient updates and persistence. 

- data_base_connection.py: Manages the connection between the solver and a MongoDB database for storing the cube state tree.

- serialize_json.py: Converts the exported JSON file from MongoDB and save it as pkl file that holds a dictionary structure of the documents for optimized fast lookups during solving.

# Dependencies:
Before running the application, ensure you have the following libraries installed. If not, install them using pip.
* pymongo: Required for connecting to MongoDB. Install with: pip install pymongo

* matplotlib: Required for visualizing the Pocket Cube in the GUI. Install with: pip install matplotlib 

* tkinter: Standard Python library for building GUIs. Already included in Python installations for most operating systems. If not installed, follow platform-specific instructions:
Linux: Install via your package manager, e.g., sudo apt-get install python3-tk.
MacOS/Windows: Ensure you have the full Python installation, as tkinter is included by default.

# Installation Instructions:
1. Clone the repository (git clone https://github.com/galvaknin10/pocket-cube-solver).
2. Unzip the tree_data.zip file in the project root to extract the preprocessed data.
3. Install the Package Locally: From the root directory of the project, run: pip install . (include the `.`).                                                                             
4. Run the Solver: After installation, run the solver using the CLI command: pocket-cube-solver
* Uninstall the Package (if needed): pip uninstall pocket-cube-solver.

# For building the tree (optional):
* If you don't already have MongoDB, install it first. You can find instructions on MongoDB's official site. 
1. Validate parameters of connect_to_mongo function inside built_tree.py and start the building processes (this might take 2.5 hours).
2. When building completed, export data to JSON format.
3. Convert the JSON file into a and save it as a dictionary with serialize_json.py, where the keys represent the unique states of the cube.
4. Follow installation instructions starting from step 3.

# Algorithm and Time Complexity:
- BFS Algorithm:
The solver uses a Breadth-First Search (BFS) algorithm to find the shortest path to solve the Pocket Cube. During the BFS tree-building phase, all unique reachable cube states are explored and stored in a MongoDB database for fast retrieval.

- Time Complexity:
BFS Tree Building: O(n), where n is the number of unique Pocket Cube states (around 3.6 million).
Why 3.6 Million Unique Cube States?
The Pocket Cube has 8 corner pieces, and each corner piece has 3 possible orientations. The number of possible arrangements of the corner pieces is calculated using the following:
1. Permutations of the 8 corners(cubelets): The number of ways to arrange 8 distinct pieces is 8! (factorial of 8): 8! = 40,320.
2. Orientations of the corners: Each corner can be oriented in 3 possible ways (x, y and z axis), but the overall orientation must valid, so only 7 cubelets orientations are independent (since the 8th corner is fixed by the orientation of the others): 3^7 = 2,187.
3. Accounting for cube rotations: Since the cube can be rotated in 24 different ways without changing its relative state (due to symmetry, 6 faces can be on the top and for each face on top the cube can be rotated in 4 different ways, by rotating it around x_axis. Thus, the total number of symmetrical configurations is 6 x 4 = 24). 
So we divide the result by 24 to account for equivalent configurations: (8! x 3^7) / 24 = 3,674,160.
This is the exact number of documents in the database after the tree-building phase is completed.

- Solution Search time: 
O(1), due to the pre-built dictionary structure that maps cube states to their solution paths.
This drastic reduction in complexity from O(n) to O(1) is achieved by storing the entire cube state tree in a MongoDB database and then converting it into a dictionary using serialize_json.py. Once the dictionary is built, the solver can quickly return the solution for any cube state in constant time.
