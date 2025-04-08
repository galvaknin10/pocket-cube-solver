import json
import pickle

# Step 1: Load the original tree data from the JSON file
with open('pocket_cube_db.cube_tree.json', 'r') as file:
    tree_data = json.load(file)

# Step 2: Preprocess the tree data into a dictionary
tree_dict = {entry['state']: entry for entry in tree_data}

# Step 3: Serialize the dictionary and save it to a file
with open('preprocessed_tree_data.pkl', 'wb') as file:
    pickle.dump(tree_dict, file)

print("Tree data has been successfully preprocessed and saved!")