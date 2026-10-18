"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import { updateWorldInteractions } from "@/systems/interactions/manager";
import { createNpcVisibilityQuery, entranceIsVisible } from "@/systems/interactions/visibility";
import type { PlayerBodyRef, PlayerRuntimeRef } from "@/types/player";
import type { BuildingInteractable } from "@/types/interaction";
import type { NpcDefinition } from "@/types/npc";

export function InteractionManager({ runtime, body }: { runtime: PlayerRuntimeRef; body: PlayerBodyRef }) {
  const { world, rapier } = useRapier();
  const ray = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }), [rapier]);
  const npcQuery = useMemo(() => createNpcVisibilityQuery(world, new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 })), [world, rapier]);
  const visible = (target: BuildingInteractable) => entranceIsVisible(world, ray, runtime.current.position, target, body.current ?? undefined);
  const visibleNpc = (npc: NpcDefinition) => npcQuery(runtime.current.position, npc, body.current ?? undefined);
  // Physics has priority -50; evaluate fresh positions before camera/visual frames.
  useFrame(() => {
    if (body.current) updateWorldInteractions(runtime.current, visible, visibleNpc, performance.now());
  }, -5);
  return null;
}
