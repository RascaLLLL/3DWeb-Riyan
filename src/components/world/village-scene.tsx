"use client";

import { Suspense, useMemo } from "react";
import { Physics } from "@react-three/rapier";
import { worldConfig } from "@/data/world";
import { useGameStore } from "@/stores/game-store";
import { graphicsPresets } from "@/systems/graphics";
import { createVillageModel } from "@/systems/world/village-model";
import { createTerrainData } from "@/systems/world/terrain-data";
import { playerConfig } from "@/data/player";
import type { PlayerBodyRef, PlayerRuntimeRef } from "@/types/player";
import { StaticInstances } from "./environment/static-instances";
import { Terrain } from "./environment/terrain";
import { WorldColliders } from "./physics/world-colliders";
import { PlayerController } from "./player/player-controller";
import { ThirdPersonCamera } from "./player/third-person-camera";
import { InteractionManager } from "./interactions/interaction-manager";
import { BuildingSigns } from "./environment/building-signs";
import { VillageNpcs } from "./npcs/village-npcs";

export function VillageScene({ runtime, body, debugColliders }: { runtime: PlayerRuntimeRef; body: PlayerBodyRef; debugColliders: boolean }) {
  const quality = useGameStore((s) => s.graphicsQuality);
  const paused = useGameStore((s) => s.gamePaused);
  const preset = graphicsPresets[quality];
  const model = useMemo(() => createVillageModel(), []);
  const terrain = useMemo(() => createTerrainData(), []);
  const { lighting } = worldConfig;
  return <>
    <color attach="background" args={[lighting.sky]} />
    <fog attach="fog" args={[lighting.sky, lighting.fogNear, lighting.fogFar]} />
    <ambientLight intensity={.65} color="#fff3d7" />
    <hemisphereLight args={["#dbe7ed", "#7c8056", 1.25]} />
    <directionalLight position={lighting.sunPosition} intensity={2.1} color="#ffe1ac" castShadow={preset.shadows}
      shadow-mapSize={[preset.shadowMapSize, preset.shadowMapSize]} shadow-normalBias={.07} shadow-bias={-.00015}
      shadow-camera-left={-42} shadow-camera-right={42} shadow-camera-top={42} shadow-camera-bottom={-42}
      shadow-camera-near={1} shadow-camera-far={115} />
    <Terrain data={terrain} />
    <StaticInstances parts={model.parts} shadows={preset.shadows} />
    <BuildingSigns />
    <Suspense fallback={null}>
      <Physics timeStep={playerConfig.fixedStep} interpolate paused={paused} colliders={false}
        debug={process.env.NODE_ENV === "development" && debugColliders} updatePriority={-50}>
        <WorldColliders obstacles={model.obstacles} parts={model.parts} terrain={terrain} />
        <VillageNpcs runtime={runtime} />
        <PlayerController runtime={runtime} body={body} />
        <InteractionManager runtime={runtime} body={body} />
        <ThirdPersonCamera runtime={runtime} body={body} />
      </Physics>
    </Suspense>
  </>;
}

