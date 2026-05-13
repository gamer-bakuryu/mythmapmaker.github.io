import React from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

function CanvasArea() {
  return (
    <div className="w-full h-full bg-black">

      <Canvas
        camera={{
          position: [20, 20, 20],
          fov: 60
        }}
        shadows
      >

        <ambientLight intensity={0.5} />

        <directionalLight
          position={[10, 20, 10]}
          intensity={2}
          castShadow
        />

        <Grid
          args={[100, 100]}
          cellSize={1}
          sectionSize={5}
          fadeDistance={200}
          fadeStrength={1}
          infiniteGrid
        />

        <mesh
          rotation-x={-Math.PI / 2}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />

          <meshStandardMaterial color="#3b7d4f" />
        </mesh>

        <OrbitControls />

      </Canvas>

    </div>
  );
}

export default CanvasArea;
