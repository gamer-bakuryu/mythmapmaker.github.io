import * as THREE from 'three'

import { scene } from './scene'

export function setupLighting(){

  const ambient = new THREE.AmbientLight('#ffffff',0.3)

  scene.add(ambient)

  const sun = new THREE.DirectionalLight('#ffffff',2)

  sun.position.set(300,400,200)

  sun.castShadow = true

  sun.shadow.mapSize.width = 4096
  sun.shadow.mapSize.height = 4096

  scene.add(sun)
}
