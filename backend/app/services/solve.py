from .load_data import TREE_DATA  
from .pocket_cube import Pocket_Cube  

def solve_cube(user_state: str):
    """Finds the solution path by backtracking from the given state."""

    # print(f"THREE DATA: {list(TREE_DATA.keys())[:5]}")
    # print(f"user state: {user_state}")

    # print("test")

    # if "BBBBGGGGYYOOWWRROOWWRRYY" in TREE_DATA:
    #     print("ofcourse")
    # else: 
    #     print("NOOOOO")

    cube = Pocket_Cube()
    cube.update_faces_by_symmetry(user_state)

    # print(f"update_cube: {user_cube.hash_rep()}")

    document = None  # Initialize variable to hold the matching dictionary entry

    possible_rotations = cube.normalize_cube_by_symmetry()


    # print("possible rotation")

    for rotation in possible_rotations:
        if rotation in TREE_DATA:
            document = TREE_DATA.get(rotation)
            break

    if document is None: 
        return

    curr_state = document.get("state")

    soloution_state = "BBBBGGGGOOOORRRRWWWWYYYY"

    # print("user cube: ", user_cube.hash_rep())

    
    path = []
    print(f'CUBE STATE: {curr_state}')
    while curr_state != soloution_state:
        print("nice")
        action_to_parent = document.get("action")
        print(action_to_parent)
        layer = translate_action_to_layer(action_to_parent)
        print(layer)
        path.append(layer)

        curr_state = document.get("parent")
        if curr_state in TREE_DATA:
            document = TREE_DATA.get(curr_state)
        else:
            return

    path.append("Congratulations!")

    return { "solution": path }

def translate_action_to_layer(action):
    if "top" in action:
        return "U"
    elif "bottom" in action:
        return "D"
    elif "most" in action:
        return "F"
    elif "less" in action:
        return "B"
    elif "right" in action:
        return "L"
    else:
        return "R"
    
