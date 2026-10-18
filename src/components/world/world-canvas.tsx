"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGameStore } from "@/stores/game-store";
import { graphicsPresets } from "@/systems/graphics";
import { worldConfig } from "@/data/world";
import { PCFShadowMap } from "three";
import { VillageScene } from "./village-scene";
import { WorldFallback } from "./world-fallback";
import { LandmarkLabels, LandmarkProjection } from "./environment/landmark-labels";
import type { RapierRigidBody } from "@react-three/rapier";
import { createPlayerRuntime } from "@/systems/player/motion";
import { PlayerHUD } from "./player/player-hud";

function ContextLossHandler({ onLost }: { onLost: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => { event.preventDefault(); onLost(); };
    canvas.addEventListener("webglcontextlost", handleLost);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [gl, onLost]);
  return null;
}

export default function WorldCanvas() {
  const quality = useGameStore((s) => s.graphicsQuality);
  const paused = useGameStore((s) => s.gamePaused);
  const [contextLost, setContextLost] = useState(false);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const runtime = useRef(createPlayerRuntime());
  const body = useRef<RapierRigidBody | null>(null);
  const [debug, setDebug] = useState(false);
  const [debugColliders, setDebugColliders] = useState(false);
  const handleContextLoss = useCallback(() => setContextLost(true), []);
  const preset = graphicsPresets[quality];
  if (contextLost) return <WorldFallback />;
  return <div className="canvas-container" onContextMenu={(e) => e.preventDefault()}>
    <Canvas camera={{ position: [worldConfig.spawn.position[0], 4.2, worldConfig.spawn.position[2] + 7], fov: 50, near: .12, far: worldConfig.camera.far }} dpr={preset.dpr}
      shadows={preset.shadows ? { type: PCFShadowMap } : false} frameloop={paused ? "demand" : "always"}
      fallback={<p>A medieval village with five landmarks around a central square. Use the village directory below or Quick Portfolio to access its information.</p>}>
      <ContextLossHandler onLost={handleContextLoss} />
      <VillageScene runtime={runtime} body={body} debugColliders={debugColliders && debug} />
      <LandmarkProjection labels={labels} />
    </Canvas>
    <LandmarkLabels labels={labels} />
    <PlayerHUD runtime={runtime} debug={debug} setDebug={setDebug} colliders={debugColliders} setColliders={setDebugColliders} />
  </div>;
}
