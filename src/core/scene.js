import * as THREE from 'three'

export const scene = new THREE.Scene()

scene.background = new THREE.Color('#08090d')
scene.fog = new THREE.Fog('#08090d', 500, 8000)
