import * as THREE from 'three'

export function createGrid(size = 5000, divisions = 200) {
  const grid = new THREE.GridHelper(
    size,
    divisions,
    '#00ffff',
    '#333333'
  )

  grid.position.y = 0

  return grid
}

export default function GridSystem() {
  return null
}
