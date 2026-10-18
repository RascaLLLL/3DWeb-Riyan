"use client";

import { useEffect, useMemo } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { npcs } from "@/data/npcs";
import type { PlayerRuntimeRef } from "@/types/player";
import { createNpcResources } from "./npc-resources";
import { NpcCharacter } from "./npc-character";

export function VillageNpcs({ runtime }: { runtime: PlayerRuntimeRef }) {
  const resources = useMemo(() => createNpcResources(), []);
  useEffect(() => () => resources.dispose(), [resources]);
  return <group dispose={null}>{npcs.map((npc) => <RigidBody key={npc.id} type="fixed" position={npc.position}
    name={`npc-${npc.id}`} userData={{ kind: "npc", id: npc.id }} colliders={false}>
    <CapsuleCollider args={[.6, .28]} position={[0, .88, 0]} friction={0} />
    <NpcCharacter npc={npc} runtime={runtime} resources={resources} />
  </RigidBody>)}</group>;
}
