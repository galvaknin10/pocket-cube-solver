import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";

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
        {state.split("").map((color, index) => (
          <mesh
            key={index}
            position={[index % 2, Math.floor(index / 4), (index % 4) - 1]}
            onClick={() => handleUserRotation(color)} // User clicks to rotate
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={highlightMove && highlightMove[0] === color ? "yellow" : faceColors[color]} />
          </mesh>
        ))}
      </group>
    </Canvas>
  );
};

export default Cube3D;
