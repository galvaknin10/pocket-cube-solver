from pydantic import BaseModel

class CubeState(BaseModel):
    cube_data: str  # Represented as a string for compactness
