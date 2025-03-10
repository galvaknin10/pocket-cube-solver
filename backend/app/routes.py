from fastapi import APIRouter
from app.solve import solve_cube

router = APIRouter()

@router.get("/solve/{state}")
def solve(state: str):
    """Solves the Pocket Cube from the given state."""
    return solve_cube(state)


