/**
 * Determines which layer of the cube should rotate based on the clicked face and cubie's position.
 *
 * @param {string} face - The face that was clicked (e.g. "U", "D", "F", etc.)
 * @param {string|number} x - The cubie's x-position (from dataset, may be a string)
 * @param {string|number} y - The cubie's y-position
 * @param {string|number} z - The cubie's z-position
 * @returns {string|null} - The layer to rotate (e.g. "U", "F", etc.) or null if no match
 */
export function getLayerFromFaceAndPosition(face, x, y, z) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    z = parseInt(z, 10);
  
    switch (face) {
      case "U":
        return y === 1 ? "U" : null;
      case "D":
        return y === -1 ? "D" : null;
      case "F":
        return z === 1 ? "F" : null;
      case "B":
        return z === -1 ? "B" : null;
      case "R":
        return x === 1 ? "R" : null;
      case "L":
        return x === -1 ? "L" : null;
      default:
        return null;
    }
  }
  

/**
 * Scrambles the cube by rotating random layers in random directions.
 *
 * @param {Function} rotateLayerCubies - Function to rotate a single layer
 * @param {Function} setIsScrambling - State setter to mark scramble in progress
 * @param {Function} showScrambleMessage - Function to show scramble UI message
 */
export const scrambleCube = async (
    rotateLayerCubies,
    setIsScrambling,
    showScrambleMessage,
    scrambleLength = 20
  ) => {
    showScrambleMessage("This might take a moment... check out some gemini insights in the meantime");
    const faces = ["U", "D", "L", "R", "F", "B"];
    const directions = [90, -90];
  
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    setIsScrambling(true);
  
    for (let i = 0; i < scrambleLength; i++) {
      const randomFace = faces[Math.floor(Math.random() * faces.length)];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
  
      rotateLayerCubies(randomFace, randomDir);
      await delay(1000); // Optional delay for UI effect
    }
  
    setIsScrambling(false);
    showScrambleMessage("Scrambling Complete!");
  };
  

/**
 * Converts the cube state object (with positions and colors)
 * into a flattened string format that matches what the backend expects.
 * The string represents 6 faces in this order: U, D, F, B, R, L.
 * Each face is made of 4 stickers (2x2), with colors mapped to single letters.
 *
 * Example return: "BBGGOORRWWYY..." (24 characters total)
 */
  export const flattenCubeStateByPosition = (cubeState) => {
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


/**
 * Returns a blank cube state — an array of 8 cubies,
 * each with its position defined but no color stickers assigned.
 * Used as a clean slate when reconstructing cube state from a string.
 */
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
  

  /**
 * Reconstructs and reorients the cube state based on a 24-character string.
 * The string represents the cube’s sticker layout across U, D, F, B, R, L faces.
 * It maps each sticker to its correct cubie and face, applying colors accordingly.
 *
 * @param {string} cubeString - 24-letter string representing the cube colors.
 * @param {function setCubeState(state)}
 }}
 */
  export function reorientCubeFromString(cubeString, setCubeState) {
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