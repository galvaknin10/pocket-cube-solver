# load_data.py — Loads the serialized cube solution tree from a .pkl file

import pickle

# Path to the preprocessed tree data 
PKL_FILE = "/data/tree_data.pkl"

def load_tree_data():
    """
    Loads the BFS tree containing all cube states and solution paths.
    
    Returns:
        dict: A dictionary where keys are cube states (str) and values are solution steps.
    """
    with open(PKL_FILE, "rb") as file:
        data = pickle.load(file)
    return data

# Load the tree data once when the app starts
# This prevents reloading on every request and keeps it in memory for fast access
TREE_DATA = load_tree_data()
