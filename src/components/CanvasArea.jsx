import React from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import CanvasSystem from "../systems/canvasSystem";
import GridSystem from "../systems/gridSystem";

function CanvasArea() {
  return (
    <div className="w-full h-full bg-[#1a1a1a]">

      <Canvas
        shadows
        camera={{
          position: [20, 20, 20],
          fov: 60
        }}
      >

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[20, 30, 20]}
          intensity={3}
          castShadow
        />

        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[100, 100]} />

          <meshStandardMaterial color="#4f8a3f" />
        </mesh>

        <GridSystem />

        <CanvasSystem />

        <OrbitControls />

      </Canvas>

    </div>
  );
}

export default CanvasArea;
