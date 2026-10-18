import type { Ball, Collider, RigidBody, Vector, World } from "@dimforge/rapier3d-compat";
import { playerConfig } from "@/data/player";
import { shortestAngle } from "./motion";
import type { Vec3 } from "@/types/world";

const identity = { x: 0, y: 0, z: 0, w: 1 };

/** Choose the closer side of the pair, limiting the cinematic turn to 90 degrees. */
export function conversationCameraYaw(currentYaw: number, player: { x: number; z: number }, npc: Vec3) {
  const pairYaw = Math.atan2(npc[0] - player.x, npc[2] - player.z);
  const sideA = pairYaw + Math.PI / 2, sideB = pairYaw - Math.PI / 2;
  return Math.abs(shortestAngle(currentYaw, sideA)) < Math.abs(shortestAngle(currentYaw, sideB)) ? sideA : sideB;
}

export function cameraSafeDistance(world: World, sphere: Ball, origin: Vector, direction: Vector, requested: number, player?: RigidBody, predicate?: (collider: Collider) => boolean) {
  // A sphere sweep protects the near-plane area, rather than only a single ray.
  const hit = world.castShape(origin, identity, direction, sphere, 0, requested, true, undefined, undefined, undefined, player, predicate);
  return hit ? Math.max(.1, hit.time_of_impact - playerConfig.camera.collisionMargin) : requested;
}
