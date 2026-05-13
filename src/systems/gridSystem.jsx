import { Grid } from '@react-three/drei'

export default function GridSystem() {
  return (
    <Grid
      args={[5000, 200]}
      sectionColor="#00ffff"
      cellColor="#333333"
      fadeDistance={3000}
      fadeStrength={1}
    />
  )
}
