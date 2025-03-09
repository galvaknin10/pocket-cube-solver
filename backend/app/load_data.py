import pickle

PKL_FILE = "/data/tree_data.pkl"

def load_tree_data():
    """Loads the preprocessed tree data into memory."""
    with open(PKL_FILE, "rb") as file:
        return pickle.load(file)

# Load data on startup
TREE_DATA = load_tree_data()
