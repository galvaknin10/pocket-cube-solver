/* eslint-disable default-case */
import React, { useState } from "react";
import "./Cube.css";
import API_BASE_URL from "../config";
import UnfoldedCube  from "./UnfoldedCube";


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
          console.log(cubeState);
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


        const oldColors = { ...colors };
        let newColors = {};

      
        // Helper function: assign oldFace to newFace if oldFace existed, then delete oldFace
        const reassignFace = (oldFace, newFace) => {
          if (oldColors[oldFace]) {
            newColors[newFace] = oldColors[oldFace];
          }
        };

      
        switch (layer) {
          case "U":
            if (direction > 0) {
              newPosition = [z, y, -x];
              // Keep the old U color if it existed
              if (oldColors.U) newColors.U = oldColors.U;
      
              // F->R, R->B, B->L, L->F
              reassignFace("F", "R");
              reassignFace("R", "B");
              reassignFace("B", "L");
              reassignFace("L", "F");
            } else {
              newPosition = [-z, y, x];
              if (oldColors.U) newColors.U = oldColors.U;
      
              // F->L, L->B, B->R, R->F
              reassignFace("F", "L");
              reassignFace("L", "B");
              reassignFace("B", "R");
              reassignFace("R", "F");
            }
            break;
      
          // ...repeat the same pattern for D, F, B, R, L...
        
      
          case "D":
            if (direction > 0) {
              newPosition = [z, y, -x];
              if (oldColors.D) newColors.D = oldColors.D;

      
              // F->L, L->B, B->R, R->F (for example)
              reassignFace("F", "R");
              reassignFace("L", "F");
              reassignFace("B", "L");
              reassignFace("R", "B");



            } else {
              newPosition = [-z, y, x];
              if (oldColors.D) newColors.D = oldColors.D;

      
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
              if (oldColors.F) newColors.F = oldColors.F;
              
      
              // U->L, L->D, D->R, R->U
              reassignFace("R", "D");
              reassignFace("U", "R");
              reassignFace("L", "U");
              reassignFace("D", "L");
            } else {
              newPosition = [-y, x, z];
              if (oldColors.F) newColors.F = oldColors.F;
              
      
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
              if (oldColors.B) newColors.B = oldColors.B;
              
      
              // U->R, R->D, D->L, L->U
              reassignFace("L", "D");
              reassignFace("U", "L");
              reassignFace("R", "U");
              reassignFace("D", "R");
            } else {
              newPosition = [y, -x, z];
              if (oldColors.B) newColors.B = oldColors.B;
              
      
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
              if (oldColors.R) newColors.R = oldColors.R;
              
      
              // U->F, F->D, D->B, B->U
              reassignFace("F", "U");
              reassignFace("U", "B");
              reassignFace("B", "D");
              reassignFace("D", "F");
            } else {
              newPosition = [x, -z, y];
              if (oldColors.R) newColors.R = oldColors.R;
              
      
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
              if (oldColors.L) newColors.L = oldColors.L;

      
              // U->B, B->D, D->F, F->U
              reassignFace("B", "U");
              reassignFace("U", "F");
              reassignFace("F", "D");
              reassignFace("D", "B");
            } else {
              newPosition = [x, z, -y];
              if (oldColors.L) newColors.L = oldColors.L;

      
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
      await delay(1000); 
    }
    setIsScrambling(false); // Scrambling done
    showScrambleMessage("Scrambling Complete!");
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
          showErrorMessage("Invalid pocket cube. Can't solve.");
          setSolutionSteps(null);
          return;
        }

        let noticeMessage = false;
  
        // If we got a symmetrical match, reorient the cube
        if (symmetryData.state !== cubeString) {
          reorientCubeFromString(symmetryData.state);
          showNoticeMessage("Solution found! Notice: Cube has been switched to an identical symmetric state. Feel free to Adapt your cube to this new orientation and when ready click on Guide Me.");
          noticeMessage = true;
        }
  
        // Now request the solution steps from /solve
        const solveRes = await fetch(`${API_BASE_URL}/solve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cube_data: symmetryData.state }),
        });
        const solveData = await solveRes.json();
  
  
        if (solveData.solution[0] === "Congratulations!") {
          showCubeAlreadySolvedMessage("Cube is already in its solved state, nothing do to...");  // Show the success message after the delay
          setSolutionSteps([]); // Reset solution steps if needed
          return;
        } else if (!noticeMessage) {
          showSolutionFoundMessage("Solution found! Click On Guide Me.");
        }
        

        setSolutionSteps(solveData.solution);

      } catch (err) {
        console.error("Error finding or solving:", err);
      }
    };

    const showMessage = (message, messageType, duration = 3000) => {
      // Remove any existing messages
      document.querySelectorAll('.message').forEach(msg => msg.remove());
    
      const messageBox = document.createElement("div");
      messageBox.classList.add(messageType, "message");
      messageBox.innerText = message.toUpperCase(); // Uppercase the text
      document.body.appendChild(messageBox);
    
      setTimeout(() => {
        messageBox.remove();
      }, duration);
    };
    
    // Example message functions
    const showErrorMessage = (message) => showMessage(message, "error-message", 4000);
    const showNoticeMessage = (message) => showMessage(message, "notice-message", 15000);
    const showSolutionFoundMessage = (message) => showMessage(message, "solution-message", 4000);
    const showSuccessMessage = (message) => showMessage(message, "success-message", 4000);
    const showCubeAlreadySolvedMessage = (message) => showMessage(message, "already-solved-message", 4000);
    const showNoSolutionMessage = (message) => showMessage(message, "no-solution-message", 4000);
    const showGuidingArrowsMessage = (message) => showMessage(message, "guiding-arrows-message", 4000);
    const showRestartCubeMessage = (message) => showMessage(message, "restart-cube-message", 4000);
    const showScrambleMessage = (message) => showMessage(message, "scramble-cube-message", 4000);


  

  
    // 2) "Guide Me" button
    const handleGuideMe = () => {
      if (!solutionSteps || solutionSteps.length === 0) {
        showNoSolutionMessage("No solution steps. Click 'Find Solution' first.");
        return;
      }
      // Start from the first move
      setGuideMode(true);
      setCurrentStepIndex(0);
      showManualStep(0);

      showGuidingArrowsMessage("Follow the guiding arrows to proceed!");
    };



  const showManualStep = (index) => {
      const layer = solutionSteps[index];
    // If it's some special marker like "Congratulations!"
    if (layer === "Congratulations!") {
      showSuccessMessage("Cube Solved!");
      setGuideMode(false);
      setSolutionSteps([]);
      // setCurrentStepIndex(0);
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



  const handleReset = () => {
    const solvedCubeString = "BBBBGGGGOOOORRRRWWWWYYYY";
    reorientCubeFromString(solvedCubeString);
    setCubeState(initialCubeState);
    setSolutionSteps([]);
    setIsScrambling(false);
    setCurrentStepIndex(0);
    setGuideMode(false);
    const layers = ["U", "D", "L", "R", "F", "B"];
    for (const layer of layers) {
      removeArrowsFromLayer(layer);
    }
    
    showRestartCubeMessage("Restart cube state");
  };


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


  const colorDict = {
    "#ffffff": "white",
    "#ffff00": "yellow",
    "#0000ff": "blue",
    "#006400": "green",
    "#ff0000": "red",
    "#ffa500": "orange"
  };


  return (
    <div>
      <div className="button-container">
        <button className="scramble" onClick={scrambleCube} disabled={isScrambling || guideMode}>Scramble</button>
        <button className="find-solution" onClick={handleFindSolution} disabled={guideMode > 0 || isScrambling}>Solve</button>
        <button className="guide-me" onClick={handleGuideMe} disabled={guideMode || isScrambling}>Guide Me</button>
        <button className="reset" onClick={handleReset} disabled={cubeState === initialCubeState || isScrambling}>Reset</button>
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
                      colors: { ...cubie.colors, [face]: colorDict[newColor] },
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
