/* eslint-disable default-case */
import React, { useState, useEffect } from "react";
import "./Cube.css";
import API_BASE_URL from "../config";
import UnfoldedCube  from "./UnfoldedCube";




// const defaultColors = {
//   U: "blue",   // Up
//   D: "green",  // Down
//   F: "orange", // Front
//   B: "red",    // Back
//   L: "white",  // Left
//   R: "yellow", // Right
// };


const initialCubeState = [
  {
    id: "UBL",
    position: [-1, 1, -1],
    colors: { U: "blue", B: "red", L: "yellow" },
  },
  {
    id: "UBR",
    position: [1, 1, -1],
    colors: { U: "blue", B: "red", R: "white" },
  },
  {
    id: "UFL",
    position: [-1, 1, 1],
    colors: { U: "blue", F: "orange", L: "yellow" },
  },
  {
    id: "UFR",
    position: [1, 1, 1],
    colors: { U: "blue", F: "orange", R: "white" },
  },
  {
    id: "DBL",
    position: [-1, -1, -1],
    colors: { D: "green", B: "red", L: "yellow" },
  },
  {
    id: "DBR",
    position: [1, -1, -1],
    colors: { D: "green", B: "red", R: "white" },
  },
  {
    id: "DFL",
    position: [-1, -1, 1],
    colors: { D: "green", F: "orange", L: "yellow" },
  },
  {
    id: "DFR",
    position: [1, -1, 1],
    colors: { D: "green", F: "orange", R: "white" },
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
  const [shouldSolve, setShouldSolve] = useState(false);
  const [rotation, setRotation] = useState({ x: -30, y: 45 }); // Whole-cube rotation
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [guideMode, setGuideMode] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [manualColorMode, setManualColorMode] = useState(false);


  

  // --- MOUSE EVENTS ---
  const handleMouseDown = (event) => {
    event.preventDefault();
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
    
    if (!guideMode) {
      // B) If dragging a face to rotate that layer
      if (selectedLayer) {
        const deltaX = event.clientX - dragStart.x;
        if (Math.abs(deltaX) > 30) {
          const direction = deltaX > 0 ? 90 : -90;
          rotateLayerCubies(selectedLayer, direction);
          setSelectedLayer(null); // Prevent repeated rotations on same drag
        }
      }
    } else {
      const expectedLayer = solutionSteps[currentStepIndex]; 
      if (selectedLayer === expectedLayer) {
        const deltaX = event.clientX - dragStart.x;
        const direction = deltaX > 0 ? 90 : -90;
        let validRotate = false;

        if ((selectedLayer === "U" || selectedLayer === "F" || selectedLayer === "R" || selectedLayer === "D") && direction === 90) {
          validRotate = true;
        }

        if ((selectedLayer === "B" || selectedLayer === "L") && direction === -90) {
          validRotate = true;
        }
      
        if (Math.abs(deltaX) > 30 && validRotate) {
          //const direction = deltaX > 0 ? 90 : -90;
          rotateLayerCubies(selectedLayer, direction);
          setSelectedLayer(null); // Prevent repeated rotations on same drag
          handleUserRotationDone();
          validRotate = false;
        }
      }
    }
  };


      // // Determine arrow direction
      // let direction = 90;
      // if (layer === "B" || layer === "L") {
      //   direction = -90;
      // }
    

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
  
      // // Helper to update a sticker only if it exists.
      // const updateColor = (colors, target, value) => {
      //   return colors.hasOwnProperty(target) ? value : undefined;
      // };
  
      const rotateCubie = (cubie) => {
        const { position, colors } = cubie;
        const [x, y, z] = position;
        let newPosition = [...position];
        let newColors = { ...colors };
      
        // Helper function: assign oldFace to newFace if oldFace existed, then delete oldFace
        const reassignFace = (oldFace, newFace) => {
          if (colors[oldFace]) {
            newColors[newFace] = colors[oldFace];
            //delete newColors[oldFace];
          }
        };
      
        switch (layer) {
          case "U":
            if (direction > 0) {
              // +90 around U
              newPosition = [z, y, -x];
              // Keep U face
              if (colors.U) newColors.U = colors.U;
      
              //F->R, R->B, B->L, L->F
              reassignFace("F", "R");
              reassignFace("R", "B");
              reassignFace("B", "L");
              reassignFace("L", "F");
            } else {
              // -90 around U
              newPosition = [-z, y, x];
              if (colors.U) newColors.U = colors.U;
      
              // F->L, L->B, B->R, R->F (the reverse mapping)
              reassignFace("F", "L");
              reassignFace("L", "B");
              reassignFace("B", "R");
              reassignFace("R", "F");
            }
            break;
      
          case "D":
            if (direction > 0) {
              newPosition = [z, y, -x];
              if (colors.D) newColors.D = colors.D;
      
              // F->L, L->B, B->R, R->F (for example)
              reassignFace("F", "R");
              reassignFace("L", "F");
              reassignFace("B", "L");
              reassignFace("R", "B");



            } else {
              newPosition = [-z, y, x];
              if (colors.D) newColors.D = colors.D;
      
              // F->R, R->B, B->L, L->F
              reassignFace("F", "L");
              reassignFace("R", "F");
              reassignFace("B", "R");
              reassignFace("L", "B");
            }
            break;
      
          case "F":
            if (direction > 0) {
              newPosition = [y, -x, z];
              if (colors.F) newColors.F = colors.F;
      
              // U->L, L->D, D->R, R->U
              reassignFace("R", "D");
              reassignFace("U", "R");
              reassignFace("L", "U");
              reassignFace("D", "L");
            } else {
              newPosition = [-y, x, z];
              if (colors.F) newColors.F = colors.F;
      
              // U->R, R->D, D->L, L->U
              reassignFace("L", "D");
              reassignFace("U", "L");
              reassignFace("R", "U");
              reassignFace("D", "R");
            }
            break;
      
          case "B":
            if (direction > 0) {
              newPosition = [-y, x, z];
              if (colors.B) newColors.B = colors.B;
      
              // U->R, R->D, D->L, L->U
              reassignFace("L", "D");
              reassignFace("U", "L");
              reassignFace("R", "U");
              reassignFace("D", "R");
            } else {
              newPosition = [y, -x, z];
              if (colors.B) newColors.B = colors.B;
      
              // U->L, L->D, D->R, R->U
              reassignFace("R", "D");
              reassignFace("U", "R");
              reassignFace("L", "U");
              reassignFace("D", "L");
            }
            break;
      
          case "R":
            if (direction > 0) {
              newPosition = [x, z, -y];
              if (colors.R) newColors.R = colors.R;
      
              // U->F, F->D, D->B, B->U
              reassignFace("F", "U");
              reassignFace("U", "B");
              reassignFace("B", "D");
              reassignFace("D", "F");
            } else {
              newPosition = [x, -z, y];
              if (colors.R) newColors.R = colors.R;
      
              // U->B, B->D, D->F, F->U
              reassignFace("B", "U");
              reassignFace("U", "F");
              reassignFace("F", "D");
              reassignFace("D", "B");
            }
            break;
      
          case "L":
            if (direction > 0) {
              newPosition = [x, -z, y];
              if (colors.L) newColors.L = colors.L;
      
              // U->B, B->D, D->F, F->U
              reassignFace("B", "U");
              reassignFace("U", "F");
              reassignFace("F", "D");
              reassignFace("D", "B");
            } else {
              newPosition = [x, z, -y];
              if (colors.L) newColors.L = colors.L;
      
              // U->F, F->D, D->B, B->U
              reassignFace("F", "U");
              reassignFace("U", "B");
              reassignFace("B", "D");
              reassignFace("D", "F");
            }
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

    setIsScrambling(true); // Start scrambling

    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
      const randomFace = faces[Math.floor(Math.random() * faces.length)];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      
      // rotateLayerCubies is your existing method to do 90° turns
      rotateLayerCubies(randomFace, randomDir);

      // Wait for a timeout before the next move (e.g., 300ms between moves)
      await delay(200); 
    }
    setIsScrambling(false); // Scrambling done
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




  // const checkSymmetryAndSolve = async () => {
  //   // 1) Flatten the user’s current cube state
  //   console.log("Cube state original format - Before update:" , cubeState);
  //   const cubeString = flattenCubeStateByPosition(cubeState);
  //   console.log("Flattened Cube String:", cubeString);

  //   try {
  //     // 2) Call your /find_symmetry endpoint first
  //     const res = await fetch(`${API_BASE_URL}/find_symmetry`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ cube_data: cubeString }),
  //     });
  //     const data = await res.json();
      
  //     if (!data.found) {
  //       console.log("No matching or symmetrical version found. Cannot solve.");
  //       return; // or show a UI error
  //     }
      
  //     // If found == true
  //     if (data.state !== cubeString) {
  //       // Means we have a symmetrical match that differs from the user's state
  //       console.log("Server suggests symmetrical reorientation:", data.state);
  //       // 3) Reorient the cube to that symmetrical version
  //       reorientCubeFromString(data.state);
  //     }

  //     else {
  //       // If no reorientation is needed, we can still trigger the solver:
  //       setShouldSolve(true);
  //     }

      
  //   } catch (err) {
  //     console.error("Error checking symmetry:", err);
  //   }
  // }

  //   // useEffect to call solver after state is updated
  // useEffect(() => {
  //   if (shouldSolve) {
  //     callSolveEndpoint(); // uses the *latest* cubeState
  //     setShouldSolve(false);
  //   }
  // }, [cubeState, shouldSolve]);
  
  // Example: callSolveEndpoint references your existing handleSolve logic
  // const callSolveEndpoint = async () => {
  //   console.log("Cube state original format - after update:" , cubeState);

  //   const cubeString = flattenCubeStateByPosition(cubeState);
  //   //const finalString = flattenCubeStateByPosition(cubeState);
  //   // the existing logic from handleSolve
  //   console.log("Cube state string - after upadate: ", cubeString);

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/solve`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ cube_data: cubeString }),
  //     });
  //     const data = await response.json();
  //     if (!data) {
  //       console.log("no matching solution found");
  //       return;
  //     }
  //     guideUserThroughSolution(data.solution);
  //   } catch (error) {
  //     console.error("Error solving:", error);
  //   }
  // };
  
  
  function createBlankCubeState() {
    return [
      {
        id: "UBL",
        position: [-1, 1, -1],
        colors: {},
      },
      {
        id: "UBR",
        position: [1, 1, -1],
        colors: {},
      },
      {
        id: "UFL",
        position: [-1, 1, 1],
        colors: {},
      },
      {
        id: "UFR",
        position: [1, 1, 1],
        colors: {},
      },
      {
        id: "DBL",
        position: [-1, -1, -1],
        colors: {},
      },
      {
        id: "DBR",
        position: [1, -1, -1],
        colors: {},
      },
      {
        id: "DFL",
        position: [-1, -1, 1],
        colors: {},
      },
      {
        id: "DFR",
        position: [1, -1, 1],
        colors: {},
      },
    ];
  }
  

  function reorientCubeFromString(cubeString) {
  // We'll parse 24 characters in blocks of 4 for U,D,F,B,R,L
  // For each block, we figure out which cubies get which face color

    const faceOrder = ["U", "D", "F", "B", "R", "L"];
    // A helper to convert a single letter like 'B' or 'O' back to e.g. "blue" or "orange"
    const colorMapReverse = {
      "W": "white",
      "Y": "yellow",
      "B": "blue",
      "G": "green",
      "R": "red",
      "O": "orange",
    };

    // 1) Create a blank 8-cubie array
    let newState = createBlankCubeState();

    // 2) Define the “index → coordinate” for each face
    const getUCoordinateByIndex = (i) => {
      // Inverse of your getUIndex. 
      switch(i) {
        case 2: return [1, 1, -1];   // x=1,z=-1
        case 3: return [-1,1, -1];  // x=-1,z=-1
        case 0: return [1, 1, 1];    // x=1,z=1
        case 1: return [-1,1, 1];    // x=-1,z=1
        default:
          return " "
      }
    };

    const getDCoordinateByIndex = (i) => {
      switch(i) {
        case 2: return [-1,-1,-1];
        case 3: return [1, -1, -1];
        case 0: return [-1,-1, 1];
        case 1: return [1, -1, 1];
        default:
          return " "
      }
    };

    const getFCoordinateByIndex = (i) => {
      switch(i) {
        case 0: return [-1,1,1];
        case 1: return [1, 1,1];
        case 2: return [-1,-1,1];
        case 3: return [1, -1,1];
        default:
          return " "
      }
    };

    
    const getBCoordinateByIndex = (i) => {
      switch(i) {
        case 0: return [1,1,-1];
        case 1: return [-1, 1,-1];
        case 2: return [1,-1,-1];
        case 3: return [-1, -1,-1];
        default:
          return " "
      }
    };

    const getLCoordinateByIndex = (i) => {
      switch(i) {
        case 1: return [-1,1,1];
        case 0: return [-1, 1,-1];
        case 3: return [-1,-1,1];
        case 2: return [-1, -1,-1];
        default:
          return " "
      }
    };

    
    const getRCoordinateByIndex = (i) => {
      switch(i) {
        case 1: return [1,1,-1];
        case 0: return [1, 1,1];
        case 3: return [1,-1,-1];
        case 2: return [1, -1,1];
        default:
          return " "
      }
    };
    // Similarly define getFCoordinateByIndex, getBCoordinateByIndex, etc...
    // matching how you set up getFIndex, getBIndex, etc.

    // 3) A helper that finds the cubie in newState that matches a coordinate
    function findCubieByPosition(x, y, z) {
      return newState.find(c => 
        c.position[0] === x &&
        c.position[1] === y &&
        c.position[2] === z
      );
    }

    // 4) Parse the cubeString in 6 chunks of 4
    let offset = 0;
    for (let face of faceOrder) {
      const faceChars = cubeString.slice(offset, offset+4); // next 4 letters
      offset += 4;

      for (let i = 0; i < 4; i++) {
        const letter = faceChars[i];  // e.g. 'B', 'O', 'W'
        const colorString = colorMapReverse[letter] || "unknown";

        let xyz;
        if (face === "U") {
          xyz = getUCoordinateByIndex(i);
        } else if (face === "D") {
          xyz = getDCoordinateByIndex(i);
        } 
        else if (face === "F") { xyz = getFCoordinateByIndex(i); }
        else if (face === "B") { xyz = getBCoordinateByIndex(i); }
        else if (face === "R") { xyz = getRCoordinateByIndex(i); }
        else if (face === "L") { xyz = getLCoordinateByIndex(i); }

        const [x,y,z] = xyz;
        // find the matching cubie
        const cubie = findCubieByPosition(x,y,z);
        if (cubie) {
          cubie.colors[face] = colorString;
        }
      }
    }
    // fill in newState
    setCubeState(newState);

    // Also set a flag
    //setShouldSolve(true);
  }

  
    // 1) "Find Solution" button
    const handleFindSolution = async () => {
      if (isScrambling) {
        return;
      }

      const cubeString = flattenCubeStateByPosition(cubeState);
  
      try {
        // Check for symmetry
        const symmetryRes = await fetch(`${API_BASE_URL}/find_symmetry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cube_data: cubeString }),
        });
        const symmetryData = await symmetryRes.json();
  
        if (!symmetryData.found) {
          console.log("No symmetrical version found. Can't solve.");
          setSolutionSteps(null);
          return;
        }
  
        // If we got a symmetrical match, reorient the cube
        if (symmetryData.state !== cubeString) {
          reorientCubeFromString(symmetryData.state);
          console.log("notice: cube switch to identical symmetic state - adapt your cube with this symmetrica state")
        }
  
        // Now request the solution steps from /solve
        const solveRes = await fetch(`${API_BASE_URL}/solve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cube_data: symmetryData.state }),
        });
        const solveData = await solveRes.json();
  
  
        if (solveData.solution[0] === "Congratulations!") {
          console.log("Cube is already in its solved state");
          showSuccessMessage();
          setSolutionSteps(null);
          return;
        }

        setSolutionSteps(solveData.solution);

        console.log("Solution steps are ready. Click 'Guide Me' to start solving.");
      } catch (err) {
        console.error("Error finding or solving:", err);
      }
    };
  
    // 2) "Guide Me" button
    const handleGuideMe = () => {
      if (!solutionSteps || solutionSteps.length === 0) {
        console.log("No solution steps. Click 'Find Solution' first.");
        return;
      }
      // Start from the first move
      setGuideMode(true);
      setCurrentStepIndex(0);
      showManualStep(0);
    };
    


  // const guideUserThroughSolution = async (solutionMoves) => {
  //   for (const layer of solutionMoves) {

  //     if (layer === "Congratulations!") {
  //       console.log("Done!");
  //       return;
  //     }

  //     let direction = 90;
  //     if (layer === "B" || layer === "L") {
  //       direction = -90;
  //     }
  //     // Show guidance with an arrow
  //     showArrowOnFace(layer, direction);
  
  //     // Wait before animating the move
  //     await delay(1000);  // 1-second pause before executing the move
  
  //     // Perform the rotation (animate and update state)
  //     rotateLayerCubies(layer, direction);
  
  //     // Remove the arrow after the move
  //     removeArrowFromFace(layer);
  
  //     // Wait before moving to the next step
  //     await delay(1000);
  //   }
  
  //   // Final success message
  //   showSuccessMessage();
  // };
  

  const showManualStep = (index) => {
    // If we’re beyond the last move, show success
    if (index >= solutionSteps.length) {
      showSuccessMessage();
      return;
    }
  
    const layer = solutionSteps[index];
    // If it's some special marker like "Congratulations!"
    if (layer === "Congratulations!") {
      showSuccessMessage();
      setGuideMode(false);
      return;
    }
  
    // Determine arrow direction
    let direction = 90;
    if (layer === "B" || layer === "L") {
      direction = -90;
    }
  
    // Display the arrow on the correct face
    showArrowsOnLayer(layer, direction);
  
    // Now we wait for the user to rotate manually...
    // The user will click "Next" or some UI button once they’ve done the move
  };

  const handleUserRotationDone = () => {
    // Remove the arrow from the current face
    const layer = solutionSteps[currentStepIndex];
    removeArrowsFromLayer(layer);
  
    // Move on to the next step
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    showManualStep(nextIndex);
  };
  
  

  const showArrowsOnLayer = (layer, direction) => {
    setTimeout(() => {
      // Grab all .cubie-face elements whose data-face matches
      const faceElements = document.querySelectorAll(`.cubie-face[data-face="${layer}"]`);
  
      faceElements.forEach((face) => {
        // Create the arrow element
        const arrow = document.createElement("div");
        arrow.classList.add("rotation-arrow");
  
        if (layer === "U") {
          arrow.innerHTML = direction < 0 ? "↻" : "↺";
        } else {
          arrow.innerHTML = direction > 0 ? "↻" : "↺";
        }
  
        // Append the arrow to the face
        face.appendChild(arrow);
      });
    }, 200); // Delay of 200ms; adjust as needed
  };
  


  

  // Remove arrows from every face in that layer
  const removeArrowsFromLayer = (layer) => {
    const faceElements = document.querySelectorAll(`.cubie-face[data-face="${layer}"]`);

    faceElements.forEach((face) => {
      const arrow = face.querySelector(".rotation-arrow");
      if (arrow) arrow.remove();
    });
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
  






  // const UnfoldedCube = ({ cubeState, onChangeColor }) => {
  //   return (
  //     <div className="unfolded-cube">
  //       <div className="face face-U">
  //         <FaceGrid face="U" cubeState={cubeState} onChangeColor={onChangeColor} />
  //       </div>
  //       <div className="face face-L">
  //         <FaceGrid face="L" cubeState={cubeState} onChangeColor={onChangeColor} />
  //       </div>
  //       <div className="face face-F">
  //         <FaceGrid face="F" cubeState={cubeState} onChangeColor={onChangeColor} />
  //       </div>
  //       <div className="face face-R">
  //         <FaceGrid face="R" cubeState={cubeState} onChangeColor={onChangeColor} />
  //       </div>
  //       <div className="face face-B">
  //         <FaceGrid face="B" cubeState={cubeState} onChangeColor={onChangeColor} />
  //       </div>
  //       <div className="face face-D">
  //         <FaceGrid face="D" cubeState={cubeState} onChangeColor={onChangeColor} />
  //       </div>
  //     </div>
  //   );
  // };
  
  
// function renderFace(face, cubeState, onChangeColor) {
//   return (
//     <div className="face-grid">
//       {cubeState
//         .filter((cubie) => cubie.colors[face])
//         .sort((a, b) => a.id.localeCompare(b.id))
//         .map((cubie) => {
//           const hexColor = colorToHex(cubie.colors[face]);
//           return (
//             <div 
//               key={cubie.id} 
//               className="sticker" 
//               style={{ backgroundColor: hexColor }}
//             >
//               <input
//                 type="color"
//                 value={hexColor}
//                 onChange={(e) => onChangeColor(cubie.id, face, e.target.value)}
//                 style={{
//                   /* Make the input cover the entire sticker but remain invisible */
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   opacity: 0,
//                   cursor: "pointer",
//                 }}
//               />
//             </div>
//           );
//         })}
//     </div>
//   );
// }

  
//   const colorToHex = (colorName) => {
//     const map = {
//       white: "#ffffff",
//       yellow: "#ffff00",
//       blue: "#0000ff",
//       green: "#006400",
//       red: "#ff0000",
//       orange: "#ffa500",
//     };
//     return map[colorName] || "#000000";
//   };
  




















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
      <div className="button-container">
        <button className="scramble" onClick={scrambleCube}>Scramble</button>
        <button className="find-solution" onClick={handleFindSolution}>Find Solution</button>
        <button className="guide-me" onClick={handleGuideMe}>Guide Me</button>
        <button 
          className="manual-color" 
          onClick={() => setManualColorMode((prev) => !prev)}
        >
          {manualColorMode ? "Back to 3D Cube" : "Manual Color Pick"}
        </button>
      </div>

      {manualColorMode ? (
        <UnfoldedCube
          cubeState={cubeState}
          onChangeColor={(cubieId, face, newColor) => {
            setCubeState((prev) =>
              prev.map((cubie) =>
                cubie.id === cubieId
                  ? {
                      ...cubie,
                      colors: { ...cubie.colors, [face]: newColor },
                    }
                  : cubie
              )
            );
          }}
        />
      ) : (
        // The existing 3D cube rendering
        <div
          className="cube-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="cube"
            draggable="false"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          >
            {renderCubies()}
          </div>
        </div>
      )}

    </div>
  );
  
  
  
};

export default Cube;  // Export the Cube component
