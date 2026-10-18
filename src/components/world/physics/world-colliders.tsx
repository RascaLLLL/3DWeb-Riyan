"use client";

import { useMemo } from "react";
import { ConvexHullCollider, CuboidCollider, CylinderCollider, RigidBody, TrimeshCollider } from "@react-three/rapier";
import { worldConfig } from "@/data/world";
import { createRoofColliders, createSurfaceObstacles } from "@/systems/world/collision-data";
import type { createTerrainData } from "@/systems/world/terrain-data";
import type { ScenePart, StaticObstacle } from "@/types/world";

export function WorldColliders({ obstacles, parts, terrain }: {
  obstacles: StaticObstacle[]; parts: ScenePart[]; terrain: ReturnType<typeof createTerrainData>;
}) {
  const surfaces = useMemo(() => createSurfaceObstacles(), []);
  const roofs = useMemo(() => createRoofColliders(parts), [parts]);
  return <RigidBody type="fixed" colliders={false} name="village-collision" friction={0} restitution={0}>
    <TrimeshCollider args={[terrain.positions, terrain.indices]} />
    <CylinderCollider args={[.075, worldConfig.square.radius]} position={[0, .075, 0]} />
    {[...obstacles, ...surfaces].map((obstacle) => <CuboidCollider key={obstacle.id}
      args={obstacle.halfExtents} position={obstacle.center} rotation={[0, obstacle.rotation, 0]} />)}
    {roofs.map((roof, index) => <ConvexHullCollider key={`roof-${index}`} args={[roof.vertices]} position={roof.position} rotation={roof.rotation} />)}
  </RigidBody>;
}
