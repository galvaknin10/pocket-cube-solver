from app.services.pocket_cube import Pocket_Cube  
from app.services.mongo_client import get_document

def find_symmetric_state(cube_state: str):
    """
    Checks if the given user_state is in TREE_DATA directly.
    If not, tries all symmetrical rotations.
    Returns either the exact or a symmetrical state if found.
    """

    # 1) Check direct match
    document = get_document(cube_state)
    if document:
        # It's directly in the DB, so no reorientation needed
        return { 
            "found": True, 
            "state": cube_state, 
            "message": "Exact match found in TREE_DATA. No extra reorientation needed." 
        }
    
    # 2) No direct match found — attempt to find a symmetrical equivalent of the input state
    # Build a Pocket_Cube instance and update its faces accordingly
    cube = Pocket_Cube()
    cube.update_faces_by_symmetry(cube_state)
    
    # 3) Try symmetrical versions
    possible_rotations = cube.normalize_cube_by_symmetry()
    for rotation in possible_rotations:
        document = get_document(rotation)
        if document:
            # Found a symmetrical match

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
