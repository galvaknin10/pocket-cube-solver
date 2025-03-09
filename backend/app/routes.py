from fastapi import APIRouter
from backend.app.load_data import TREE_DATA

router = APIRouter()

@router.get("/solve/{state}")
def solve_cube(state: str):
    """Retrieves the solution for a given cube state."""
    return TREE_DATA.get(state, {"error": "State not found"})
