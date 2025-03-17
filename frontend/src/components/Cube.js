import React, { useState } from "react";
import "./Cube.css";
import API_BASE_URL from "../config";

const defaultColors = {
  U: "blue",   // Up
  D: "green",  // Down
  F: "orange", // Front
  B: "red",    // Back
  L: "white",  // Left
  R: "yellow", // Right
};


const initialCubeState = [
  {
    id: "UBL",
    position: [-1, 1, -1],
    colors: { ...defaultColors, U: "blue", B: "red", L: "yellow" },
  },
  {
    id: "UBR",
    position: [1, 1, -1],
    colors: { ...defaultColors, U: "blue", B: "red", R: "white" },
  },
  {
    id: "UFL",
    position: [-1, 1, 1],
    colors: { ...defaultColors, U: "blue", F: "orange", L: "yellow" },
  },
  {
    id: "UFR",
    position: [1, 1, 1],
    colors: { ...defaultColors, U: "blue", F: "orange", R: "white" },
  },
  {
    id: "DBL",
    position: [-1, -1, -1],
    colors: { ...defaultColors, D: "green", B: "red", L: "yellow" },
  },
  {
    id: "DBR",
    position: [1, -1, -1],
    colors: { ...defaultColors, D: "green", B: "red", R: "white" },
  },
  {
    id: "DFL",
    position: [-1, -1, 1],
    colors: { ...defaultColors, D: "green", F: "orange", L: "yellow" },
  },
  {
    id: "DFR",
    position: [1, -1, 1],
    colors: { ...defaultColors, D: "green", F: "orange", R: "white" },
  },
];


// Helper that decides exactly which layer to rotate, given the face clicked
// and the (x,y,z) position of that cubie.
function getLayerFromFaceAndPosition(face, x, y, z) {
  // Convert to integers, since dataset attributes come as strings
  x = parseInt(x, 10);
  y = parseInt(y, 10);
  z = parseInt(z, 10);

  switch (face) {
    case "U":
      // Only rotate top layer if y=1
      return y === 1 ? "U" : null;

    case "D":
      // Only rotate bottom layer if y=-1
      return y === -1 ? "D" : null;

    case "F":
      // Only rotate front layer if z=1
      return z === 1 ? "F" : null;

    case "B":
      // Only rotate back layer if z=-1
      return z === -1 ? "B" : null;

    case "R":
      // Only rotate right layer if x=1
      return x === 1 ? "R" : null;

    case "L":
      // Only rotate left layer if x=-1
      return x === -1 ? "L" : null;

    default:
      return null;
  }
}

const Cube = () => {
  const [cubeState, setCubeState] = useState(initialCubeState);
  const [rotation, setRotation] = useState({ x: -30, y: 45 }); // Whole-cube rotation
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedLayer, setSelectedLayer] = useState(null);

  // --- MOUSE EVENTS ---
  const handleMouseDown = (event) => {
    // 1) Check if you clicked on a specific face via data-face
    const faceElement = event.target.closest(".cubie-face");
    if (faceElement) {
      const face = faceElement.dataset.face; // e.g., "U", "R", ...
      if (face) {
        // Grab the parent .cubie to read its data-x, data-y, data-z
        const cubieEl = faceElement.closest(".cubie");
        if (cubieEl) {
          const { x, y, z } = cubieEl.dataset;
          // Figure out the *actual* layer to rotate, if any
          const layer = getLayerFromFaceAndPosition(face, x, y, z);

          if (layer) {
            setSelectedLayer(layer);
            setDragStart({ x: event.clientX, y: event.clientY });
            return; // Skip rotating the whole cube
          }
        }
      }
    }

    // 2) Otherwise, rotate the entire cube
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    // A) If dragging the whole cube
    const MAX_ROTATION_X = 90;  // Maximum x rotation
    const MIN_ROTATION_X = -90; // Minimum x rotation
    
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
    
      // Update x with the deltaY, but clamp it between MIN_ROTATION_X and MAX_ROTATION_X
      setRotation((prev) => {
        const newX = prev.x - deltaY * 0.3;
        const newY = prev.y + deltaX * 0.3;
    
        return {
          x: Math.max(MIN_ROTATION_X, Math.min(newX, MAX_ROTATION_X)), // Clamp x
          y: newY,
        };
      });
    
      setDragStart({ x: event.clientX, y: event.clientY });
    }
    

    // B) If dragging a face to rotate that layer
    if (selectedLayer) {
      const deltaX = event.clientX - dragStart.x;
      if (Math.abs(deltaX) > 30) {
        const direction = deltaX > 0 ? 90 : -90;
        rotateLayerCubies(selectedLayer, direction);
        setSelectedLayer(null); // Prevent repeated rotations on same drag
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedLayer(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setSelectedLayer(null);
  };

  const rotateLayerCubies = (layer, direction) => {
    setCubeState((prevState) => {
      const newState = [...prevState];
      let axisIndex, axisValue;
      switch (layer) {
        case "U":
          axisIndex = 1; // y
          axisValue = 1;
          break;
        case "D":
          axisIndex = 1;
          axisValue = -1;
          break;
        case "F":
          axisIndex = 2; // z
          axisValue = 1;
          break;
        case "B":
          axisIndex = 2;
          axisValue = -1;
          break;
        case "R":
          axisIndex = 0; // x
          axisValue = 1;
          break;
        case "L":
          axisIndex = 0;
          axisValue = -1;
          break;
        default:
          return newState;
      }
      const affectedCubies = newState.filter(
        (c) => c.position[axisIndex] === axisValue
      );
  
      // Helper to update a sticker only if it exists.
      const updateColor = (colors, target, value) => {
        return colors.hasOwnProperty(target) ? value : undefined;
      };
  
      const rotateCubie = (cubie) => {
        const { position, colors } = cubie;
        const [x, y, z] = position;
        let newPosition = [...position];
        let newColors = { ...colors };
  
        switch (layer) {
          case "U":
            if (direction > 0) {
              newPosition = [z, y, -x];
              newColors.U = colors.U; // U always exists for top-layer cubies.
              if (colors.F) newColors.F = updateColor(colors, "F", colors.L);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.F);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.R);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.B);
            } else {
              newPosition = [-z, y, x];
              newColors.U = colors.U;
              if (colors.F) newColors.F = updateColor(colors, "F", colors.R);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.B);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.L);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.F);
            }
            break;
  
          case "D":
            if (direction > 0) {
              newPosition = [z, y, -x];
              newColors.D = colors.D;
              if (colors.F) newColors.F = updateColor(colors, "F", colors.L);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.B);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.R);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.F);
            } else {
              newPosition = [-z, y, x];
              newColors.D = colors.D;
              if (colors.F) newColors.F = updateColor(colors, "F", colors.R);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.B);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.L);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.F);
            }
            break;
  
          case "F":
            if (direction > 0) {
              newPosition = [y, -x, z];
              newColors.F = colors.F;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.L);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.R);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.U);
            } else {
              newPosition = [-y, x, z];
              newColors.F = colors.F;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.R);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.L);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.U);
            }
            break;
  
          case "B":
            if (direction > 0) {
              newPosition = [-y, x, z];
              newColors.B = colors.B;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.R);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.L);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.U);
            } else {
              newPosition = [y, -x, z];
              newColors.B = colors.B;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.L);
              if (colors.L) newColors.L = updateColor(colors, "L", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.R);
              if (colors.R) newColors.R = updateColor(colors, "R", colors.U);
            }
            break;
  
          case "R":
            if (direction > 0) {
              newPosition = [x, z, -y];
              newColors.R = colors.R;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.F);
              if (colors.F) newColors.F = updateColor(colors, "F", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.B);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.U);
            } else {
              newPosition = [x, -z, y];
              newColors.R = colors.R;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.B);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.F);
              if (colors.F) newColors.F = updateColor(colors, "F", colors.U);
            }
            break;
  
          case "L":
            if (direction > 0) {
              newPosition = [x, -z, y];
              newColors.L = colors.L;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.B);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.F);
              if (colors.F) newColors.F = updateColor(colors, "F", colors.U);
            } else {
              newPosition = [x, z, -y];
              newColors.L = colors.L;
              if (colors.U) newColors.U = updateColor(colors, "U", colors.F);
              if (colors.F) newColors.F = updateColor(colors, "F", colors.D);
              if (colors.D) newColors.D = updateColor(colors, "D", colors.B);
              if (colors.B) newColors.B = updateColor(colors, "B", colors.U);
            }
            break;
          default:
            break;
        }
        return { ...cubie, position: newPosition, colors: newColors };
      };
  
      const updated = {};
      affectedCubies.forEach((cubie) => {
        updated[cubie.id] = rotateCubie(cubie);
      });
  
      return newState.map((c) => updated[c.id] || c);
    });
  };
  
const scrambleCube = async () => {
  // Decide how many random moves you want:
  const SCRAMBLE_LENGTH = 15; // or 20, etc.

  const faces = ["U", "D", "L", "R", "F", "B"];
  const directions = [90, -90]; // clockwise or counterclockwise

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Delay function

  for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    
    // rotateLayerCubies is your existing method to do 90° turns
    rotateLayerCubies(randomFace, randomDir);

    // Wait for a timeout before the next move (e.g., 300ms between moves)
    await delay(300); 
  }
};

const flattenCubeStateByPosition = (cubeState) => {
  // Convert color strings to single-letter codes
  const getColorLetter = (color) => {
    const colorMap = {
      white: "W",
      yellow: "Y",
      blue: "B",
      green: "G",
      red: "R",
      orange: "O",
    };
    return colorMap[color] || "?";
  };

  // ========== U FACE ========== 
  // y === 1, have a U sticker
  const getUIndex = (cubie) => {
    const [x, _, z] = cubie.position;
    // Example: top-left => 0, top-right => 1, bottom-left => 2, bottom-right => 3
    // Fill in the coordinates that physically match each slot.
    // (Just like your existing getUIndex)
    if (x ===  1 && z === -1) return 2;  
    if (x === -1 && z === -1) return 3;
    if (x ===  1 && z ===  1) return 0;
    if (x === -1 && z ===  1) return 1;
    return 99; 
  };

  // ========== D FACE ========== 
  // y === -1, have a D sticker
  const getDIndex = (cubie) => {
    const [x, _, z] = cubie.position;
    // TODO: Decide how you'd like to label D's top-left => 0, top-right => 1, etc.
    // For instance:
    // if (x=-1,z=-1) => 0, (x=1,z=-1) => 1, (x=-1,z=1) => 2, (x=1,z=1) => 3
    // or any arrangement that yields the correct “visual” order for D.
    if (x === -1 && z === -1) return 2;
    if (x ===  1 && z === -1) return 3;
    if (x === -1 && z ===  1) return 0;
    if (x ===  1 && z ===  1) return 1;
    return 99;
  };

  // ========== F FACE ==========
  const getFIndex = (cubie) => {
    const [x, y, z] = cubie.position;
    // y is your vertical axis, x is left-right, z=1 for front
    // Decide which coordinate combos map to top-left => 0, top-right => 1, etc.
    // Example:
    // if (y=1, x=-1) => 0, (y=1, x=1) => 1, (y=-1, x=-1) => 2, (y=-1, x=1) => 3
    // So you end up with top row = y=1, bottom row = y=-1, left col = x=-1, right col = x=1
    if (y ===  1 && x === -1) return 0;
    if (y ===  1 && x ===  1) return 1;
    if (y === -1 && x === -1) return 2;
    if (y === -1 && x ===  1) return 3;
    return 99;
  };

  // ========== B FACE ==========
  const getBIndex = (cubie) => {
    const [x, y, z] = cubie.position;
    // Similar logic for the back face (z=-1).
    // If you want top-left => y=1,x=1 => 0, etc., fill it in:
    if (y ===  1 && x ===  1) return 0;
    if (y ===  1 && x === -1) return 1;
    if (y === -1 && x ===  1) return 2;
    if (y === -1 && x === -1) return 3;
    return 99;
  };

  // ========== L FACE ==========
  const getLIndex = (cubie) => {
    const [x, y, z] = cubie.position;
    // x = -1 for left
    // Decide top-left => (?), top-right => (?), bottom-left => (?), etc.
    // Possibly y=1 => top, z=-1 => left, etc.
    if (y === 1 && z === 1) return 1;
    if (y === 1 && z === -1) return 0;
    if (y === -1 && z === 1) return 3;
    if (y === -1 && z === -1) return 2;
    return 99;
  };

  // ========== R FACE ==========
  const getRIndex = (cubie) => {
    const [x, y, z] = cubie.position;
    // x=+1 for right
    // Fill in your top-left -> index0, top-right -> index1, etc.
    if (y ===  1 && z === -1) return 1;
    if (y ===  1 && z ===  1)  return 0;
    if (y === -1 && z === -1) return 3;
    if (y === -1 && z ===  1) return 2;
    return 99;
  };

  // The main function to get stickers for each face:
  const getFaceStickers = (face) => {
    let filtered = [];
    switch (face) {
      case "U": {
        filtered = cubeState.filter(c => c.position[1] === 1 && c.colors.U);
        filtered.sort((a, b) => getUIndex(a) - getUIndex(b));
        return filtered.map(c => getColorLetter(c.colors.U)).join("");
      }
      case "D": {
        filtered = cubeState.filter(c => c.position[1] === -1 && c.colors.D);
        filtered.sort((a, b) => getDIndex(a) - getDIndex(b));
        return filtered.map(c => getColorLetter(c.colors.D)).join("");
      }
      case "F": {
        filtered = cubeState.filter(c => c.position[2] === 1 && c.colors.F);
        filtered.sort((a, b) => getFIndex(a) - getFIndex(b));
        return filtered.map(c => getColorLetter(c.colors.F)).join("");
      }
      case "B": {
        filtered = cubeState.filter(c => c.position[2] === -1 && c.colors.B);
        filtered.sort((a, b) => getBIndex(a) - getBIndex(b));
        return filtered.map(c => getColorLetter(c.colors.B)).join("");
      }
      case "L": {
        filtered = cubeState.filter(c => c.position[0] === -1 && c.colors.L);
        filtered.sort((a, b) => getLIndex(a) - getLIndex(b));
        return filtered.map(c => getColorLetter(c.colors.L)).join("");
      }
      case "R": {
        filtered = cubeState.filter(c => c.position[0] === 1 && c.colors.R);
        filtered.sort((a, b) => getRIndex(a) - getRIndex(b));
        return filtered.map(c => getColorLetter(c.colors.R)).join("");
      }
      default:
        return "";
    }
  };

  // Flatten in the face order your solver expects
  const faceOrder = ["U", "D", "F", "B", "R", "L"];
  return faceOrder.map(face => getFaceStickers(face)).join("");
};






  // Helper function to map colors to single-character letters
  const getColorLetter = (color) => {
    const colorMap = {
      white: "W",
      yellow: "Y",
      blue: "B",
      green: "G",
      red: "R",
      orange: "O",
    };
    return colorMap[color] || "?"; // Default to "?" if a color is missing
  };



  const handleSolve = async () => {
    // Convert cubeState into a flat string
    const cubeString = flattenCubeStateByPosition(cubeState);
    console.log("Flattened Cube String:", cubeString);
    try {
      const response = await fetch(`${API_BASE_URL}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cube_data: cubeString }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (data === null) {
        console.log("no matching solution found");
        return;
      }

      const solutionMoves = data.solution;

      // Run animation or guide user through solution
      guideUserThroughSolution(solutionMoves);
    } catch (error) {
      console.error("Error solving:", error);
    }
  };

  

  const guideUserThroughSolution = async (solutionMoves) => {
    for (const layer of solutionMoves) {

      if (layer === "Congratulations!") {
        console.log("Done!");
        return;
      }

      let direction = 90;
      if (layer === "R" || layer === "B") {
        direction = -90;
      }
      // Show guidance with an arrow
      showArrowOnFace(layer, direction);
  
      // Wait before animating the move
      await delay(1000);  // 1-second pause before executing the move
  
      // Perform the rotation (animate and update state)
      rotateLayerCubies(layer, direction);
  
      // Remove the arrow after the move
      removeArrowFromFace(layer);
  
      // Wait before moving to the next step
      await delay(1000);
    }
  
    // Final success message
    showSuccessMessage();
  };
  

  const showArrowOnFace = (layer, direction) => {
    const faceElement = document.querySelector(`.face-${layer}`); // Select the correct face div
    if (!faceElement) return;

    // Create an arrow element
    const arrow = document.createElement("div");
    arrow.classList.add("rotation-arrow");
    arrow.innerHTML = direction > 0 ? "⟳" : "⟲"; // Clockwise or counterclockwise symbol
    faceElement.appendChild(arrow);
  };


  const removeArrowFromFace = (layer) => {
    const faceElement = document.querySelector(`.face-${layer}`);
    if (!faceElement) return;
  
    const arrow = faceElement.querySelector(".rotation-arrow");
    if (arrow) arrow.remove();
  };
  

  const showSuccessMessage = () => {
    const messageBox = document.createElement("div");
    messageBox.classList.add("success-message");
    messageBox.innerText = "🎉 Cube Solved!";
    document.body.appendChild(messageBox);
  
    setTimeout(() => {
      messageBox.remove(); // Remove after 3 seconds
    }, 3000);
  };
  

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  // --- RENDERING ---
  const renderCubies = () =>
    cubeState.map((cubie) => {
      const { id, position, colors } = cubie;
      const [cx, cy, cz] = position;

      return (
        <div
          key={id}
          className="cubie"
          data-x={cx}     // So we can read them on click
          data-y={cy}
          data-z={cz}
          style={{
            position: "absolute",
            width: "88px",
            height: "88px",
            transform: `translate3d(${cx * 45}px, ${-cy * 45}px, ${cz * 45}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {Object.entries(colors).map(([face, color]) => (
            <div
              key={face}
              className="cubie-face"
              data-face={face} // e.g., "U", "D", "F", etc.
              style={{
                position: "absolute",
                width: "80px",
                height: "80px",
                border: "8px solid black",
                backgroundColor: color,
                transform: getFaceTransform(face),
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      );
    });

  // Places each face in the correct orientation
  const getFaceTransform = (face) => {
    switch (face) {
      case "U":
        return "rotateX(90deg) translateZ(45px)";
      case "D":
        return "rotateX(-90deg) translateZ(45px)";
      case "F":
        return "translateZ(45px)";
      case "B":
        return "rotateY(180deg) translateZ(45px)";
      case "L":
        return "rotateY(-90deg) translateZ(45px)";
      case "R":
        return "rotateY(90deg) translateZ(45px)";
      default:
        return "";
    }
  };



  return (
    <div>
      <button onClick={scrambleCube}>Scramble</button> {/* Add the scramble button here */}
      <button onClick={handleSolve} style={{ marginLeft: "10px" }}>Solve</button> {/* Solve button */}
      <div
        className="cube-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ width: "700px", height: "700px", position: "relative" }}
      >
        <div
          className="cube"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
            position: "absolute",
            width: "100px",
            height: "100px",
          }}
        >
          {renderCubies()}
        </div>
      </div>
    </div>
  );
};

export default Cube;  // Export the Cube component
