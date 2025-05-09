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
    """
    Endpoint to fetch a fun fact from the cube-ai-agent (Gemini API).

    Flow:
    - Sends a GET request to the cube-ai service's /fun-fact endpoint
    - Waits up to 60 seconds for a response
    - Returns the fun fact as JSON if successful
    - Returns 503 if the service is unavailable or still waking up
    """

    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.get(f"{AI_SERVICE_URL}/fun-fact")
        if res.status_code == 200 and res.content:
            print(res)
            return res.json()

    raise HTTPException(503, "Gemini’s still waking—please try again shortly...")
