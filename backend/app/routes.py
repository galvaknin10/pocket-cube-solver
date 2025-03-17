from fastapi import APIRouter
from app.models import CubeState
from app.services.solve import solve_cube  # ✅ Updated path

router = APIRouter()

@router.post("/solve")
def solve(state: CubeState):
    """Receives cube state and returns solution."""
    return solve_cube(state.cube_data)

