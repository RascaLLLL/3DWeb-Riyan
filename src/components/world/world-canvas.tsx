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
import { useInteractionStore } from "@/stores/interaction-store";
import { ProximityPrompt } from "./interactions/proximity-prompt";
import { BuildingPanelManager } from "./interactions/building-panel-manager";
import { useDialogueStore } from "@/stores/dialogue-store";
import { useGuidanceStore } from "@/stores/guidance-store";
import { DialogueInterface } from "./dialogue/dialogue-interface";
import { ExplorationInterface } from "./exploration/exploration-interface";
import { closeExplorationPanel } from "@/systems/exploration/panels";
import { WorldHUD } from "./hud/world-hud";
import { PauseMenu } from "./hud/pause-menu";
import { PlayerDiagnostics } from "./player/player-diagnostics";
import { useWorldDebugStore } from "@/stores/world-debug-store";

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
  const conversation = useGameStore((s) => s.activePanel === "dialogue");
  const [contextLost, setContextLost] = useState(false);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const runtime = useRef(createPlayerRuntime());
  const body = useRef<RapierRigidBody | null>(null);
  const surface = useRef<HTMLCanvasElement | null>(null);
  const debug = useWorldDebugStore((state) => state.visible);
  const debugColliders = useWorldDebugStore((state) => state.colliders);
  const handleContextLoss = useCallback(() => setContextLost(true), []);
  const restoreFocus = useCallback(() => {
    const game = useGameStore.getState();
    if (game.gameStarted && game.activePanel === null && surface.current?.isConnected) surface.current.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const reset = () => {
      useDialogueStore.getState().reset();
      useInteractionStore.getState().reset();
      useGuidanceStore.getState().reset();
      closeExplorationPanel(performance.now());
      useWorldDebugStore.getState().reset();
    };
    return reset;
  }, []);
  useEffect(() => {
    if (contextLost) {
      useDialogueStore.getState().reset();
      useInteractionStore.getState().reset();
      useGuidanceStore.getState().reset();
      closeExplorationPanel(performance.now());
    }
  }, [contextLost]);
  const preset = graphicsPresets[quality];
  if (contextLost) return <WorldFallback />;
  return <div className="world-exploration"><div className="canvas-container" onContextMenu={(e) => e.preventDefault()}>
    <Canvas camera={{ position: [worldConfig.spawn.position[0], 4.2, worldConfig.spawn.position[2] + 7], fov: 50, near: .12, far: worldConfig.camera.far }} dpr={preset.dpr}
      shadows={preset.shadows ? { type: PCFShadowMap } : false} frameloop={paused && !conversation ? "demand" : "always"}
      onCreated={({ gl }) => { surface.current = gl.domElement; }}
      fallback={<WorldFallback />}>
      <ContextLossHandler onLost={handleContextLoss} />
      <VillageScene runtime={runtime} body={body} debugColliders={process.env.NODE_ENV === "development" && debugColliders && debug} />
      <LandmarkProjection labels={labels} />
    </Canvas>
    <LandmarkLabels labels={labels} />
  </div>
  <div className="world-hud">
    <WorldHUD />
    <PlayerHUD runtime={runtime} restoreFocus={restoreFocus} />
    <ProximityPrompt runtime={runtime} />
    {process.env.NODE_ENV === "development" && <PlayerDiagnostics runtime={runtime} />}
  </div>
  <div className="world-panel-layer">
    <PauseMenu restoreFocus={restoreFocus} />
    <BuildingPanelManager restoreFocus={restoreFocus} />
    <DialogueInterface restoreFocus={restoreFocus} />
    <ExplorationInterface runtime={runtime} restoreFocus={restoreFocus} />
  </div></div>;
}
