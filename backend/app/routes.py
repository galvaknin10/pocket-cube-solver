# routes.py — Defines API endpoints for cube operations

from fastapi import APIRouter
from app.models import CubeState  # Pydantic model for validating input
from app.services.solve import solve_cube  # Core logic to solve a cube
from app.services.symmetry import find_symmetric_state  # Handles symmetry detection
from app.services.load_data import TREE_DATA

# Create a new API router instance
router = APIRouter()


@router.post("/find_symmetry")
def find_symmetry(state: CubeState):
    """
    Endpoint to check if a given cube state exists in the solution tree
    (either directly or as a symmetrical variant).

    Parameters:
    - state: Validated JSON body containing 'cube_data' (str)

    Returns:
    - JSON response with match status, state used, and message
    """

    return find_symmetric_state(state.cube_data, TREE_DATA)


@router.post("/solve")
def solve(state: CubeState):
    """
    Endpoint to solve a given cube state.

    Parameters:
    - state: Validated JSON body containing 'cube_data' (str)

    Returns:
    - JSON response containing the solution steps or an error if unsolvable
    """

    return solve_cube(state.cube_data, TREE_DATA)
