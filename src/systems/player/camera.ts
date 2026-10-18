import type { Ball, RigidBody, Vector, World } from "@dimforge/rapier3d-compat";
import { playerConfig } from "@/data/player";

const identity = { x: 0, y: 0, z: 0, w: 1 };

export function cameraSafeDistance(world: World, sphere: Ball, origin: Vector, direction: Vector, requested: number, player?: RigidBody) {
  // A sphere sweep protects the near-plane area, rather than only a single ray.
  const hit = world.castShape(origin, identity, direction, sphere, 0, requested, true, undefined, undefined, undefined, player);
  return hit ? Math.max(.1, hit.time_of_impact - playerConfig.camera.collisionMargin) : requested;
}
