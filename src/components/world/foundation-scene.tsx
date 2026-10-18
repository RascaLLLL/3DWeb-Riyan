"use client";
import { OrbitControls } from "@react-three/drei";
import { useGameStore } from "@/stores/game-store";
import { graphicsPresets } from "@/systems/graphics";

export function FoundationScene() {
  const quality = useGameStore((s) => s.graphicsQuality);
  const paused = useGameStore((s) => s.gamePaused);
  const preset = graphicsPresets[quality];
  return <>
    <color attach="background" args={["#c9d2bd"]} />
    <fog attach="fog" args={["#c9d2bd", 16, 40]} />
    <ambientLight intensity={1.3} />
    <directionalLight position={[5, 8, 4]} intensity={2.4} color="#ffe0a4" castShadow={preset.shadows} shadow-mapSize={[preset.shadowMapSize, preset.shadowMapSize]} shadow-normalBias={0.04} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#86916b" roughness={1} /></mesh>
    <mesh position={[0, .12, 0]} receiveShadow><cylinderGeometry args={[3.2, 3.4, .24, 12]} /><meshStandardMaterial color="#b8ad8a" flatShading /></mesh>
    <group position={[0, .24, 0]}>
      <mesh position={[0, .65, 0]} castShadow><coneGeometry args={[.4, 1.1, 6]} /><meshStandardMaterial color="#7e593e" flatShading /></mesh>
      <mesh position={[0, 1.36, 0]} castShadow><icosahedronGeometry args={[.24, 0]} /><meshStandardMaterial color="#d0ac7d" flatShading /></mesh>
      <mesh position={[0, 1.56, 0]} castShadow><coneGeometry args={[.33, .22, 6]} /><meshStandardMaterial color="#58664c" flatShading /></mesh>
    </group>
    <OrbitControls enabled={!paused} enablePan={false} enableDamping={false} minDistance={4} maxDistance={14} minPolarAngle={.3} maxPolarAngle={Math.PI / 2.15} target={[0, .8, 0]} />
  </>;
}
