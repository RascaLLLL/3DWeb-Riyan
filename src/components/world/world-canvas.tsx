"use client";
import { useCallback, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGameStore } from "@/stores/game-store";
import { graphicsPresets } from "@/systems/graphics";
import { FoundationScene } from "./foundation-scene";
import { WorldFallback } from "./world-fallback";

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
  const [contextLost, setContextLost] = useState(false);
  const handleContextLoss = useCallback(() => setContextLost(true), []);
  const preset = graphicsPresets[quality];
  if (contextLost) return <WorldFallback />;
  return <div className="canvas-container" onContextMenu={(e) => e.preventDefault()}>
    <Canvas camera={{ position: [6, 4.5, 7], fov: 42 }} dpr={preset.dpr} shadows={preset.shadows} frameloop="demand"
      fallback={<p>3D preview of a resident marker on a village clearing. Use Quick Portfolio above to read all portfolio content.</p>}>
      <ContextLossHandler onLost={handleContextLoss} />
      <FoundationScene />
    </Canvas>
  </div>;
}
