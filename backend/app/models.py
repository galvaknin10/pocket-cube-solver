# models.py — Pydantic models for input validation

from pydantic import BaseModel

class CubeState(BaseModel):
    """
    Represents the structure of the incoming request body 
    for cube-related operations.

    Attributes:
    - cube_data (str): A compact string representation of the cube's state.
                       Expected to be 24 characters long (one per sticker).
    """
    cube_data: str

