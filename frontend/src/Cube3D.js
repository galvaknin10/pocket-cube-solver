import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const faceColors = {
  B: "blue",
  G: "green",
  O: "orange",
  R: "red",
  W: "white",
  Y: "yellow",
};

const Cube3D = ({ state, highlightMove, onUserRotate }) => {
  const cubeRef = useRef();

  const handleUserRotation = (layer) => {
    if (highlightMove && layer === highlightMove[0]) {
      onUserRotate(highlightMove[1]); // Notify parent (PocketCube.js) that the user rotated
    }
  };

  return (
    <Canvas>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <group ref={cubeRef}>
        {state.split("").map((color, index) => {
          const x = (index % 2) - 0.5; // Adjusted for center alignment
          const y = Math.floor(index / 4) - 0.5;
          const z = ((index % 4) - 1.5) * -1; // Adjusted to match cube layout

          return (
            <mesh key={index} position={[x, y, z]} onClick={() => handleUserRotation(index)}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={highlightMove && highlightMove[0] === color ? "yellow" : faceColors[color]} />
            </mesh>
          );
        })}
      </group>
    </Canvas>
  );
};

export default Cube3D;
