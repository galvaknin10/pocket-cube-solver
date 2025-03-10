import React, { useState } from "react";
import Cube3D from "./Cube3D";
import axios from "axios";

const PocketCube = () => {
  const [cubeState, setCubeState] = useState("WWWWGGGGRRRRBBBBYYYYOOOO");
  const [solution, setSolution] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightedMove, setHighlightedMove] = useState(null);

  const handleSolve = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/solve/${cubeState}`);
      setSolution(response.data.solution_path);
      setStepIndex(0);
      setHighlightedMove(response.data.solution_path[0]); // Highlight first move
    } catch (error) {
      console.error("Error fetching solution:", error);
    }
  };

  const handleUserRotation = (rotationAction) => {
    if (stepIndex < solution.length && solution[stepIndex][1] === rotationAction) {
      setStepIndex(stepIndex + 1); // Move to the next step
      setHighlightedMove(solution[stepIndex + 1] || null); // Highlight next move
    }
  };

  return (
    <div>
      <h1>Pocket Cube Solver</h1>

      {/* Pass highlighted move to Cube3D */}
      <Cube3D state={cubeState} highlightMove={highlightedMove} onUserRotate={handleUserRotation} />

      <button onClick={handleSolve}>Solve</button>
      <p>{highlightedMove ? `Rotate: ${highlightedMove[1]}` : "No solution yet"}</p>
    </div>
  );
};

export default PocketCube;
