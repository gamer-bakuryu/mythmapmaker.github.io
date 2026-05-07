import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  TransformControls,
  Grid,
  PerspectiveCamera
} from '@react-three/drei'

import { Suspense } from 'react'

export default function Viewport(){

  return (
    <Canvas shadows>

      <PerspectiveCamera
        makeDefault
        position={[0, 150, 150]}
      />

      <ambientLight intensity={0.3} />

      <directionalLight
        position={[100,200,100]}
        intensity={2}
        castShadow
      />

      <Grid
        args={[10000,10000]}
        sectionColor="#00ffff"
      />

      <mesh rotation-x={-Math.PI/2} receiveShadow>
        <planeGeometry args={[3140,2160,256,256]} />
        <meshStandardMaterial color="#356b3f" />
      </mesh>

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
      />

      <Suspense fallback={null}>
      </Suspense>

    </Canvas>
  )
}
