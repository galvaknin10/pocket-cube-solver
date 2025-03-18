from .load_data import TREE_DATA  
from .pocket_cube import Pocket_Cube  

def solve_cube(curr_state: str):
    """Finds the solution path by backtracking from the given state."""

    # print(f"THREE DATA: {list(TREE_DATA.keys())[:5]}")
    # print(f"user state: {user_state}")

    # print("test")

    # if "BBBBGGGGYYOOWWRROOWWRRYY" in TREE_DATA:
    #     print("ofcourse")
    # else: 
    #     print("NOOOOO")

    print(f"CURR STATE: {curr_state}")
    document = TREE_DATA.get(curr_state)
    print(document)
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
    
