import React, { useState, useEffect } from "react";
import "./Cube.css";

const initialCubeState = [
  { id: "UBL", position: [-1, 1, -1], colors: { U: "blue", B: "red", L: "white" } },
  { id: "UBR", position: [1, 1, -1], colors: { U: "blue", B: "red", R: "yellow" } },
  { id: "UFL", position: [-1, 1, 1], colors: { U: "blue", F: "orange", L: "white" } },
  { id: "UFR", position: [1, 1, 1], colors: { U: "blue", F: "orange", R: "yellow" } },
  { id: "DBL", position: [-1, -1, -1], colors: { D: "green", B: "red", L: "white" } },
  { id: "DBR", position: [1, -1, -1], colors: { D: "green", B: "red", R: "yellow" } },
  { id: "DFL", position: [-1, -1, 1], colors: { D: "green", F: "orange", L: "white" } },
  { id: "DFR", position: [1, -1, 1], colors: { D: "green", F: "orange", R: "yellow" } },
];

const Cube = () => {
  const [cubeState, setCubeState] = useState(initialCubeState);


  const [rotation, setRotation] = useState({ x: -30, y: 45 }); // Whole cube rotation
  const [isDragging, setIsDragging] = useState(false); // Only for cube rotation
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Dragging start position
  const [selectedLayer, setSelectedLayer] = useState(null); // Stores selected layer or null
  const [layerRotation, setLayerRotation] = useState({ x: 0, y: 0, z: 0 }); // 3D layer rotation
  


  const handleMouseUp = () => {
    setIsDragging(false);
  
    if (selectedLayer) {
      setLayerRotation((prevRotation) => {
        let snappedRotation = Math.round((prevRotation[getAxis(selectedLayer)] ?? 0) / 90) * 90;
        return { ...prevRotation, [getAxis(selectedLayer)]: snappedRotation };
      });
  
      setSelectedLayer(null);
    }
  };
  
  
  // Helper function to determine the correct rotation axis
  const getAxis = (layer) => {
    if (layer === "U" || layer === "D") return "y";
    if (layer === "F" || layer === "B") return "z";
    if (layer === "L" || layer === "R") return "x";
  };
  

  const handleMouseDown = (event) => {
    const clickedCubie = event.target.closest(".cubie");
  
    if (clickedCubie) {
      const layer = clickedCubie.getAttribute("data-layer")?.split(" ")[0] ?? null;
  
      if (layer) {
        setSelectedLayer(layer);
        setDragStart({ x: event.clientX, y: event.clientY });
        return;
      }
    }
  
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  

  const handleMouseMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
  
      setRotation((prevRotation) => ({
        x: Math.max(-90, Math.min(90, prevRotation.x - deltaY * 0.3)),
        y: prevRotation.y - deltaX * 0.3,
      }));
  
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  
    if (selectedLayer) {
      const deltaX = event.clientX - dragStart.x;
  
      if (Math.abs(deltaX) > 30) { // Only rotate if dragging far enough
        const direction = deltaX > 0 ? 90 : -90;
        rotateLayerCubies(selectedLayer, direction);
        setSelectedLayer(null); // Prevent continuous rotation
      }
    }
  };
  

  const rotateLayerCubies = (layer, direction) => {
    setCubeState((prevState) => {
      if (!Array.isArray(prevState)) {
        console.error("Invalid cubeState before update:", prevState);
        return prevState;
      }
  
      const newState = [...prevState];
  
      // Handle U & D layers (y-axis rotation)
      if (layer === "U" || layer === "D") {
        const affectedCubies = newState.filter(cubie => cubie.position[1] === (layer === "U" ? 1 : -1));
  
        const rotateCubie = (cubie) => {
          const { position, colors } = cubie;
          let newPosition, newColors = {};
  
          if (direction > 0) { // +90° clockwise
            newPosition = [position[2], position[1], -position[0]];
            newColors = { [layer]: colors[layer], F: colors.L, R: colors.F, B: colors.R, L: colors.B };
          } else { // -90° counter-clockwise
            newPosition = [-position[2], position[1], position[0]];
            newColors = { [layer]: colors[layer], F: colors.R, R: colors.B, B: colors.L, L: colors.F };
          }
  
          return { ...cubie, position: newPosition, colors: newColors };
        };
  
        const newCubies = {};
        affectedCubies.forEach(cubie => {
          newCubies[cubie.id] = rotateCubie(cubie);
        });
  
        return newState.map(cubie => newCubies[cubie.id] || cubie);
      }

      

  
      return newState;
    });
  };
  
  

  const getFaceTransform = (face) => {
    switch (face) {
      case "U": return "rotateX(90deg) translateZ(45px)";
      case "D": return "rotateX(-90deg) translateZ(45px)";
      case "F": return "translateZ(45px)"; // Fixed from 44px
      case "B": return "rotateY(180deg) translateZ(45px)";
      case "L": return "rotateY(-90deg) translateZ(45px)";
      case "R": return "rotateY(90deg) translateZ(45px)";
      default: return "";
    }
  };
  
  const getRotationAxis = (layer) => {
    switch (layer) {
      case "U": case "D": return [0, 1, 0]; // Y-axis rotation
      case "L": case "R": return [1, 0, 0]; // X-axis rotation
      case "F": case "B": return [0, 0, 1]; // Z-axis rotation
      default: return [0, 0, 0]; // No rotation for invalid input
    }
  };
  

  const renderCubies = () =>
    cubeState.map((cubie) => {
      const layers = Object.keys(cubie.colors);
      let layerTransform = layers
        .map(layer =>
          ` rotate3d(${getRotationAxis(layer)}, ${layerRotation[layer] ?? 0}deg)`
        )
        .join("");
  
      return (
        <div
          key={cubie.id}
          className="cubie"
          data-layer={layers.join(" ")}
          style={{
            width: "88px",
            height: "88px",
            position: "absolute",
            transform: `translate3d(${cubie.position[0] * 45}px, ${cubie.position[1] * -45}px, ${cubie.position[2] * 45}px)${layerTransform}`,
            transformStyle: "preserve-3d",
          }}
        >
          {Object.entries(cubie.colors).map(([face, color]) => (
            <div
              key={face}
              className={`cubie-face ${face}`}
              style={{
                backgroundColor: color,
                width: "80px",
                height: "80px",
                position: "absolute",
                border: "4px solid black",
                transform: getFaceTransform(face),
              }}
            ></div>
          ))}
        </div>
      );
    });
  
    return (
      <div
        className="cube-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="cube"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          {renderCubies()}
        </div>
      </div>
    );
    
};

export default Cube;
