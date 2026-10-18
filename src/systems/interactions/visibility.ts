import type { Collider, Ray, RigidBody, World } from "@dimforge/rapier3d-compat";
import { QueryFilterFlags } from "@dimforge/rapier3d-compat";
import { interactionConfig } from "@/data/building-interactions";
import { playerConfig } from "@/data/player";
import type { BuildingInteractable, InteractionPosition } from "@/types/interaction";
import type { NpcDefinition, NpcId } from "@/types/npc";

/** Reuse one Ray per scene. Every solid collider can occlude an entrance. */
export function entranceIsVisible(world: World, ray: Ray, position: InteractionPosition, target: BuildingInteractable, player?: RigidBody) {
  const [x, y, z] = target.building.interactionAnchor.position;
  return pointIsVisible(world, ray, position, x, y + interactionConfig.eyeHeight, z, player);
}

function pointIsVisible(world: World, ray: Ray, position: InteractionPosition, x: number, y: number, z: number,
  player?: RigidBody, predicate?: (collider: Collider) => boolean) {
  ray.origin.x = position.x;
  ray.origin.y = position.y - playerConfig.centerHeight + interactionConfig.eyeHeight;
  ray.origin.z = position.z;
  ray.dir.x = x - ray.origin.x;
  ray.dir.y = y - ray.origin.y;
  ray.dir.z = z - ray.origin.z;
  const length = Math.hypot(ray.dir.x, ray.dir.y, ray.dir.z);
  if (length < .03) return true;
  ray.dir.x /= length; ray.dir.y /= length; ray.dir.z /= length;
  return world.castRay(ray, length, true, QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, player, predicate) === null;
}

/** Exclude only the person being addressed, not other villagers or solid walls. */
export function createNpcVisibilityQuery(world: World, ray: Ray) {
  let addressedNpc: NpcId | null = null;
  const predicate = (collider: Collider) => {
    const data = collider.parent()?.userData as { kind?: string; id?: string } | undefined;
    return !(data?.kind === "npc" && data.id === addressedNpc);
  };
  return (position: InteractionPosition, npc: NpcDefinition, player?: RigidBody) => {
    addressedNpc = npc.id;
    return pointIsVisible(world, ray, position, npc.position[0], npc.position[1] + interactionConfig.eyeHeight, npc.position[2], player, predicate);
  };
}
