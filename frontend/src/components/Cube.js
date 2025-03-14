import React, { useState } from "react";
import "./Cube.css";

const initialCubeState = [
  { id: "UBL", position: [-1, 1, -1], colors: { U: "white", B: "green", L: "red" } },
  { id: "UBR", position: [1, 1, -1], colors: { U: "white", B: "green", R: "orange" } },
  { id: "UFL", position: [-1, 1, 1], colors: { U: "white", F: "blue", L: "red" } },
  { id: "UFR", position: [1, 1, 1], colors: { U: "white", F: "blue", R: "orange" } },
  { id: "DBL", position: [-1, -1, -1], colors: { D: "yellow", B: "green", L: "red" } },
  { id: "DBR", position: [1, -1, -1], colors: { D: "yellow", B: "green", R: "orange" } },
  { id: "DFL", position: [-1, -1, 1], colors: { D: "yellow", F: "blue", L: "red" } },
  { id: "DFR", position: [1, -1, 1], colors: { D: "yellow", F: "blue", R: "orange" } },
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
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      setRotation((prev) => ({
        x: prev.x - deltaY * 0.3,
        y: prev.y + deltaX * 0.3,
      }));
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

  // --- LAYER ROTATION LOGIC ---
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
          return newState; // no-op
      }

      // Filter for cubies in the chosen layer
      const affectedCubies = newState.filter(
        (c) => c.position[axisIndex] === axisValue
      );

      const rotateCubie = (cubie) => {
        let { position, colors } = cubie;
        const [x, y, z] = position;
        let newPosition = [...position];
        let newColors = { ...colors };

        switch (layer) {
          case "U":
            if (direction > 0) {
              // +90
              newPosition = [z, y, -x];
              newColors = {
                U: colors.U,
                F: colors.L,
                R: colors.F,
                B: colors.R,
                L: colors.B,
                D: colors.D,
              };
            } else {
              // -90
              newPosition = [-z, y, x];
              newColors = {
                U: colors.U,
                F: colors.R,
                R: colors.B,
                B: colors.L,
                L: colors.F,
                D: colors.D,
              };
            }
            break;

          case "D":
            if (direction > 0) {
              newPosition = [-z, y, x];
              newColors = {
                D: colors.D,
                F: colors.R,
                R: colors.B,
                B: colors.L,
                L: colors.F,
                U: colors.U,
              };
            } else {
              newPosition = [z, y, -x];
              newColors = {
                D: colors.D,
                F: colors.L,
                L: colors.B,
                B: colors.R,
                R: colors.F,
                U: colors.U,
              };
            }
            break;

          case "F":
            if (direction > 0) {
              // +90
              newPosition = [y, -x, z];
              newColors = {
                F: colors.F,
                U: colors.L,
                L: colors.D,
                D: colors.R,
                R: colors.U,
                B: colors.B,
              };
            } else {
              newPosition = [-y, x, z];
              newColors = {
                F: colors.F,
                U: colors.R,
                R: colors.D,
                D: colors.L,
                L: colors.U,
                B: colors.B,
              };
            }
            break;

          case "B":
            if (direction > 0) {
              newPosition = [-y, x, z];
              newColors = {
                B: colors.B,
                U: colors.R,
                R: colors.D,
                D: colors.L,
                L: colors.U,
                F: colors.F,
              };
            } else {
              newPosition = [y, -x, z];
              newColors = {
                B: colors.B,
                U: colors.L,
                L: colors.D,
                D: colors.R,
                R: colors.U,
                F: colors.F,
              };
            }
            break;

          case "R":
            if (direction > 0) {
              newPosition = [x, z, -y];
              newColors = {
                R: colors.R,
                U: colors.F,
                F: colors.D,
                D: colors.B,
                B: colors.U,
                L: colors.L,
              };
            } else {
              newPosition = [x, -z, y];
              newColors = {
                R: colors.R,
                U: colors.B,
                B: colors.D,
                D: colors.F,
                F: colors.U,
                L: colors.L,
              };
            }
            break;

          case "L":
            if (direction > 0) {
              newPosition = [x, -z, y];
              newColors = {
                L: colors.L,
                U: colors.B,
                B: colors.D,
                D: colors.F,
                F: colors.U,
                R: colors.R,
              };
            } else {
              newPosition = [x, z, -y];
              newColors = {
                L: colors.L,
                U: colors.F,
                F: colors.D,
                D: colors.B,
                B: colors.U,
                R: colors.R,
              };
            }
            break;
          default:
            break;
        }
        return { ...cubie, position: newPosition, colors: newColors };
      };

      // Create updated cubies
      const updated = {};
      affectedCubies.forEach((cubie) => {
        updated[cubie.id] = rotateCubie(cubie);
      });

      // Replace the affected cubies
      return newState.map((c) => updated[c.id] || c);
    });
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
    <div
      className="cube-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ width: "600px", height: "600px", position: "relative" }}
    >
      <div
        className="cube"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100px",
          height: "100px",
        }}
      >
        {renderCubies()}
      </div>
    </div>
  );
};

export default Cube;
