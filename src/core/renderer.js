import * as THREE from 'three'

export const renderer = new THREE.WebGLRenderer({
  antialias:true,
  powerPreference:'high-performance'
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
