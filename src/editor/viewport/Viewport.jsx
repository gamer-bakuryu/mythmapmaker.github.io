import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  Sky,
  Environment,
  ContactShadows,
  Html
} from '@react-three/drei'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'

function Terrain() {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      3140,
      2160,
      300,
      300
    )

    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)

      const height =
        Math.sin(x * 0.01) * 20 +
        Math.cos(y * 0.01) * 20 +
        Math.sin(x * 0.03) * 8 +
        Math.random() * 2

      pos.setZ(i, height)
    }

    geo.computeVertexNormals()

    return geo
  }, [])

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation-x={-Math.PI / 2}
      receiveShadow
    >
      <meshStandardMaterial
        color="#405c36"
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}

function Water() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={2}>
      <planeGeometry args={[1500, 1200]} />
      <meshPhysicalMaterial
        color="#2b6aff"
        transparent
        opacity={0.7}
        roughness={0.2}
        metalness={0.1}
        transmission={0.4}
      />
    </mesh>
  )
}

function Forest() {
  const trees = useMemo(() => {
    const arr = []

    for (let i = 0; i < 800; i++) {
      arr.push({
        x: Math.random() * 2600 - 1300,
        z: Math.random() * 1800 - 900,
        s: Math.random() * 3 + 2
      })
    }

    return arr
  }, [])

  return trees.map((t, i) => (
    <group key={i} position={[t.x, 8, t.z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.8, 8]} />
        <meshStandardMaterial color="#4b3228" />
      </mesh>

      <mesh position-y={7} castShadow>
        <coneGeometry args={[t.s, 10, 8]} />
        <meshStandardMaterial color="#234d20" />
      </mesh>
    </group>
  ))
}

function Cities() {
  const cities = [
    [-400, 10, -200],
    [300, 10, 200],
    [700, 10, -500]
  ]

  return cities.map((c, i) => (
    <group key={i} position={c}>
      <mesh castShadow>
        <boxGeometry args={[30, 20, 30]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>

      <Html distanceFactor={20}>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs border border-cyan-400">
          Cidade {i + 1}
        </div>
      </Html>
    </group>
  ))
}

function Roads() {
  const points = [
    new THREE.Vector3(-400, 4, -200),
    new THREE.Vector3(0, 6, 0),
    new THREE.Vector3(300, 4, 200)
  ]

  const curve = new THREE.CatmullRomCurve3(points)

  const geometry = new THREE.TubeGeometry(curve, 64, 4, 8, false)

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#7c6f62" />
    </mesh>
  )
}

function DynamicSun() {
  const lightRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.05

    lightRef.current.position.x = Math.sin(t) * 400
    lightRef.current.position.z = Math.cos(t) * 400
  })

  return (
    <directionalLight
      ref={lightRef}
      intensity={2}
      castShadow
      position={[200, 300, 200]}
      shadow-mapSize-width={4096}
      shadow-mapSize-height={4096}
    />
  )
}

export default function Viewport() {
  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        powerPreference: 'high-performance'
      }}
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 180, 220]}
        fov={55}
      />

      <Sky
        distance={450000}
        sunPosition={[100, 40, 100]}
      />

      <fog attach="fog" args={['#87a7c7', 500, 5000]} />

      <ambientLight intensity={0.35} />

      <DynamicSun />

      <Environment preset="forest" />

      <gridHelper args={[5000, 200, '#00ffff', '#333333']} />

      <Terrain />

      <Water />

      <Forest />

      <Cities />

      <Roads />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={500}
        blur={2}
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={40}
        maxDistance={2000}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  )
}
