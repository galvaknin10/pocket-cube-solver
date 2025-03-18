from fastapi import APIRouter
from app.models import CubeState
from app.services.solve import solve_cube
from app.services.load_data import TREE_DATA
from app.services.pocket_cube import Pocket_Cube

router = APIRouter()


@router.post("/find_symmetry")
def find_symmetry(state: CubeState):
    """
    Checks if the given user_state is in TREE_DATA directly.
    If not, tries all symmetrical rotations.
    Returns either the exact or a symmetrical state if found.
    """

    
    user_state_str = state.cube_data  # The flattened string from the frontend
    
    # 1) Build the Pocket_Cube and update faces
    cube = Pocket_Cube()
    cube.update_faces_by_symmetry(user_state_str)
    
    # 2) Check direct match
    if user_state_str in TREE_DATA:
        # It's directly in the DB, so no reorientation needed
        return { 
            "found": True, 
            "state": user_state_str, 
            "message": "Exact match found in TREE_DATA. No extra reorientation needed." 
        }
    
    # 3) Try symmetrical versions
    possible_rotations = cube.normalize_cube_by_symmetry()
    for rotation in possible_rotations:
        if rotation in TREE_DATA:
            # Found a symmetrical match
            # We can optionally get 'document = TREE_DATA[rotation]' if needed,
            # but the actual key we want to solve with is 'rotation'.
            return { 
                "found": True, 
                "state": rotation, 
                "message": "Symmetrical match found. Please reorient the cube to this version before solving." 
            }
    
    # 4) No match found at all
    return { 
        "found": False, 
        "state": None, 
        "message": "No matching or symmetrical version found in TREE_DATA."
    }



@router.post("/solve")
def solve(state: CubeState):
    """Receives cube state and returns solution."""
    return solve_cube(state.cube_data)

