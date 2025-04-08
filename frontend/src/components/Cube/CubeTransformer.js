/* eslint-disable default-case */
/**
 * Rotates all cubies in a specified layer by 90° clockwise or counter-clockwise.
 *
 * @param {string} layer - The face layer being rotated (U, D, F, B, L, R)
 * @param {number} direction - Rotation direction: 90 or -90 degrees
 * @param {Array} prevState - The current cubeState
 * @returns {Array} The new cubeState after applying rotation
 */
export default function rotateLayerCubies(layer, direction, prevState) {
    const newState = [...prevState];
    let axisIndex, axisValue;
  
    switch (layer) {
      case "U": axisIndex = 1; axisValue = 1; break;
      case "D": axisIndex = 1; axisValue = -1; break;
      case "F": axisIndex = 2; axisValue = 1; break;
      case "B": axisIndex = 2; axisValue = -1; break;
      case "R": axisIndex = 0; axisValue = 1; break;
      case "L": axisIndex = 0; axisValue = -1; break;
      default: return newState;
    }
  
    const affectedCubies = newState.filter(c => c.position[axisIndex] === axisValue);
  
    const updated = {};
    affectedCubies.forEach((cubie) => {
      updated[cubie.id] = rotateCubie(cubie, layer, direction);
    });
  
    return newState.map((c) => updated[c.id] || c);
  }  

/**
 * Rotates a single cubie’s position and updates its face colors
 * based on the layer and rotation direction.
 *
 * @param {Object} cubie - The individual cubie object.
 * @param {string} layer - The rotating face (U, D, etc.).
 * @param {number} direction - Rotation direction: 90 or -90 degrees.
 * @returns {Object} - The updated cubie with new position and colors.
 */
const rotateCubie = (cubie, layer, direction) => {
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