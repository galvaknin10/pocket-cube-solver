import React, { useState } from "react";
import "./Cube.css";

const Cube = () => {
  // Define colors for each face
  const cubeColors = {
    U: "blue",
    D: "green",
    F: "orange",
    B: "red",
    L: "white",
    R: "yellow",
  };

  // State for whole cube rotation
  const [rotation, setRotation] = useState({ x: -30, y: 45 });

  // State for layer rotation
  const [layerRotation, setLayerRotation] = useState({
    U: 0, D: 0, F: 0, B: 0, L: 0, R: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isLayerDragging, setIsLayerDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedFace, setSelectedFace] = useState(null);


  const handleFaceClick = (event, faceClass) => {
    event.stopPropagation();
    console.log(`Clicked on face: ${faceClass}`);
    setSelectedFace(faceClass);
    setIsLayerDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  
    // Test: Force a 90-degree rotation to see if it updates visually
    setLayerRotation((prevRotation) => ({
      ...prevRotation,
      [faceClass]: (prevRotation[faceClass] + 90) % 360,
    }));
  };
  
  
  
  

  // Handle mouse movement for layer rotation
  const handleLayerDrag = (event) => {
    if (!isLayerDragging || !selectedFace) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;


    console.log(`Dragging ${selectedFace} | ΔX: ${deltaX}, ΔY: ${deltaY}`); // Debug log

    // Determine axis rotation based on face clicked
    let axisRotation = deltaX * 0.5;
    if (selectedFace === "up" || selectedFace === "down") axisRotation = deltaY * 0.5;

    setLayerRotation((prevRotation) => ({
    ...prevRotation,
    [selectedFace]: (prevRotation[selectedFace] + axisRotation) % 360, // Keep rotation within 360 degrees
    }));


    setDragStart({ x: event.clientX, y: event.clientY });
  };

  // Handle mouse release (stop rotating)
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsLayerDragging(false);
    setSelectedFace(null);
  };

  // Handle whole cube rotation when clicking outside the cube
  const handleMouseDown = (event) => {
    if (event.target.classList.contains("cube-container")) {
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;

      setRotation((prevRotation) => ({
        x: prevRotation.x - deltaY * 0.5,
        y: prevRotation.y + deltaX * 0.5,

      }));

      setDragStart({ x: event.clientX, y: event.clientY });
    }
    handleLayerDrag(event); // Also check for layer rotation
  };



  const getFaceRotation = (face, layerRotation) => {
    return `rotate3d(${getRotationAxis(face)}, ${layerRotation[face]}deg)`;
  };
  
  // Helper function to determine the rotation axis
  const getRotationAxis = (face) => {
    switch (face) {
      case "up":
      case "down":
        return "1, 0, 0"; // Rotate on X-axis
      case "left":
      case "right":
        return "0, 1, 0"; // Rotate on Y-axis
      case "front":
      case "back":
        return "0, 0, 1"; // Rotate on Z-axis
      default:
        return "";
    }
  };
  
  
  
  
  const renderFace = (color, faceClass) => (
    <div
      className={`face ${faceClass}`}
      style={{
        transform: getFaceRotation(faceClass, layerRotation),
      }}
      onMouseDown={(event) => handleFaceClick(event, faceClass)} // Attach event to face
    >
      {[0, 1].map((row) =>
        [0, 1].map((col) => (
          <div
            key={`${row}-${col}`}
            className="cubie"
            style={{
              backgroundColor: color,
              width: "86px",
              height: "86px",
              position: "absolute", // Changed from absolute
              top: `${row * 90}px`,
              left: `${col * 90}px`,
              pointerEvents: "none", // Ensure clicks go to the face
            }}
          ></div>
        ))
      )}
    </div>
  );
  

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
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {renderFace(cubeColors.U, "up")}
        {renderFace(cubeColors.D, "down")}
        {renderFace(cubeColors.F, "front")}
        {renderFace(cubeColors.B, "back")}
        {renderFace(cubeColors.L, "left")}
        {renderFace(cubeColors.R, "right")}
      </div>
    </div>
  );
};

export default Cube;
