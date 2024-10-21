Pocket Cube Solver

This project provides an efficient solution for solving the Pocket Cube (2x2 Rubik's Cube) through a pre-calculated tree of cube states. Users can solve the cube by either manually inputting a specific cube configuration or generating a random cube state. The solution leverages Breadth-First Search (BFS) to explore the cube's state space, making the algorithm both robust and efficient


Files Description:
1. pocket_cube.py:
* Defines the Pocket_Cube class, representing the cube and containing methods for cube manipulation, shuffling, and normalization by symmetry.
* Includes utilities for copying the cube, generating a hash for state representation, and displaying the cube’s state.

2. built_tree.py:
* Implements the bfs_tree_build function, which builds a Breadth-First Search (BFS) tree of all possible cube states starting from the solved state. This allows for efficient lookup of cube states when solving the cube.

3. solve_cube.py:
* Contains the solve_user_cube function, which compares a user-provided cube state against the pre-built tree of cube states to determine the steps required to solve the cube.

4. data_base_connection.py:
* Manages the database connections for saving and retrieving cube states. It stores the BFS tree in MongoDB, enabling efficient lookups and ensuring persistence. This prevents the need to recalculate the tree for each session.

5. main.py:
* The main script that handles user interaction. It validates cube input, triggers tree building if necessary, and displays the solution path to the user.


Installation:
Clone the repository: git clone https://github.com/yourusername/pocket-cube-solver.git


Usage:
Run the application: python main.py
* For manual cube input, provide a string of 24 characters representing the cube state (4 characters per face: U (Up), D (Down), F (Front), B (Back), L (Left), R (Right)). Valid colors are: W, Y, O, R, G, B.
* To generate a random cube state, press A.
* The solution path will be displayed in the console.


Algorithm Efficiency and Approach:
Why Breadth-First Search (BFS)?
BFS is ideal for generating a state tree of the cube because it explores all states level-by-level. Since all moves on a 2x2 cube take the same amount of time and all edges have uniform cost, BFS guarantees that the shortest path (fewest moves) from any state to the solved state is found. BFS also ensures that all cube states are visited systematically, avoiding any redundant computations.
The BFS algorithm is particularly efficient in combination with a pre-built state tree. Once the tree is constructed, solving any cube state is reduced to a simple lookup and traversal through the tree, ensuring that solutions are found instantly without recalculating moves.

Why 3.6 Million Unique Cube States?
The Pocket Cube has 8 corner pieces, and each corner piece has 3 possible orientations. The number of possible arrangements of the corner pieces is calculated using the following:
1. Permutations of the 8 corners(cubelets): The number of ways to arrange 8 distinct pieces is 8! (factorial of 8): 8! = 40,320.
2. Orientations of the corners: Each corner can be oriented in 3 possible ways, but the overall orientation must valid, so only 7 cubelets orientations are independent (since the 8th corner is fixed by the orientation of the others): 3^7 = 2,187.
3. Accounting for cube rotations: Since the cube can be rotated in 24 different ways without changing its relative state (due to symmetry, 6 faces can be on the top and for each face on top the cube can be rotated in 4 different ways, by rotating it around x_axis. Thus, the total number of symmetrical configurations is 6 x 4 = 24). 
so we divide the result by 24 to account for equivalent configurations: (8! x 3^7) / 24 = 3,674,160.
This is the exact number of documents in the database after the tree-building phase is completed.


Space and Time Complexity:
* Time Complexity of Tree Construction (BFS): BFS runs in O(V+E), where V is the number of vertices (cube states) and E is the number of edges (possible moves between states). Since the cube has about 3.6 million states and each state has 6 possible moves, this ensures linear time complexity in terms of state exploration.
* Space Complexity: Storing the entire tree requires memory proportional to the number of states, 3.6 million
O(3.6 million), which is efficiently handled by storing the states in MongoDB.


Tree Building Phase:
The tree-building phase is a one-time process that builds all possible cube states and their transitions, allowing for fast solutions later. Here's how it works:
* Flag File: A flag file (tree_built.flag) is created after the tree-building process is completed to indicate that the tree has been built. This avoids re-running the process unnecessarily.
* Initial Check: When the program starts, it checks for the existence of this flag file:
- If the file is not found, the tree-building function is executed.
- If the file exists, the program skips the tree-building process, allowing for immediate cube-solving.
Rebuilding the Tree: To rebuild the tree (for example, if the logic is modified), simply delete the tree_built.flag file. The next time you run the program, the tree will be rebuilt.


Example of Usage:
After cloning the repository, run the main file: python main.py
* The first time the program runs, the tree will be built.
* On subsequent runs, the program will skip the tree-building phase and directly solve the cube.


By combining the mathematical properties of the cube with an efficient BFS algorithm and persistent storage, this project offers a fast and reliable way to solve the Pocket Cube. With 3.6 million unique states, solving the cube manually would be difficult, but leveraging this approach makes it straightforward.


MongoDB Setup:
The project uses MongoDB to store cube states and their relationships during the tree-building phase. Here's how to set it up:
1. Install MongoDB locally(Community Server): Enter this link: https://www.mongodb.com/try/download/community
and click on download.
2. Open Compass app (user interface) create new connection: Cube_Project (note the connection string - you will need it later on...)
3. Create new data base: pocket_cube_db
4. Create new collection: cube_tree

You'r all set up! just make sure that the parameters are passed to the function - 
connect_to_mongo(local_server: str, data_base_name: str, collection_name: str) 
are matched to your local data base.

Once MongoDB is set up, the program will build the cube state tree automatically the first time you run the application (this might take about 2 hours). Then, the tree will be store in MongoDB for fast lookups O(1) during future runs.
 

Using the Pre-Built Collection:
If you prefer not to execute the tree-building phase and want to use a pre-built collection of cube states, follow these steps:
1. After creating the cube_tree collection, click on the collection tab.
2. Hit the green plus button at the top left corner. 
3. Click  'Import JSON or CSV file' option.
4. Nevigate to the pre-built collection the located inside the zip file in repo as:  pocket_cube_db.cube_tree.json 
5. Once the import is complete, you can create the tree_built.flag file inside program's folder for skipping the building phase.
6. You're all set up!





