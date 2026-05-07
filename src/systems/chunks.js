import * as THREE from 'three'

const chunks = new Map()

const CHUNK_SIZE = 512
const RENDER_DISTANCE = 3

export function updateChunks(scene,camera){

  const cx = Math.floor(camera.position.x / CHUNK_SIZE)
  const cz = Math.floor(camera.position.z / CHUNK_SIZE)

  for(let x=cx-RENDER_DISTANCE;x<=cx+RENDER_DISTANCE;x++){
    for(let z=cz-RENDER_DISTANCE;z<=cz+RENDER_DISTANCE;z++){

      const key = `${x},${z}`

     
