import httpx
import os

# routes.py — Defines API endpoints for cube operations

from fastapi import APIRouter, HTTPException
from app.models import CubeState  # Pydantic model for validating input
from app.services.solve import solve_cube  # Core logic to solve a cube
from app.services.symmetry import find_symmetric_state  # Handles symmetry detection
import asyncio
from fastapi import HTTPException


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

    return find_symmetric_state(state.cube_data)


@router.post("/solve")
def solve(state: CubeState):
    """
    Endpoint to solve a given cube state.

    Parameters:
    - state: Validated JSON body containing 'cube_data' (str)

    Returns:
    - JSON response containing the solution steps or an error if unsolvable
    """

    return solve_cube(state.cube_data)


AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://cube-ai-agent:8000")


@router.get("/fun-fact")
async def get_fun_fact():
    async with httpx.AsyncClient(timeout=15) as client:
        # Warm-up ping (call / first)
        try:
            await client.get(f"{AI_SERVICE_URL}/")
        except httpx.RequestError:
            pass  # ignore warm-up errors

        # Then try the actual /fun-fact 3 times
        for _ in range(3):
            try:
                res = await client.get(f"{AI_SERVICE_URL}/fun-fact")
                if res.status_code == 200 and res.content:
                    return res.json()
            except httpx.RequestError:
                pass
            await asyncio.sleep(1)

    raise HTTPException(503, "AI service unavailable—please try again in a moment")
