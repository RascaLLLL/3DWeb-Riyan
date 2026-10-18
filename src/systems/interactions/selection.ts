import { interactionConfig } from "@/data/building-interactions";
import { worldConfig } from "@/data/world";
import { playerConfig } from "@/data/player";
import type { BuildingInteractable, InteractionPosition, VisibilityQuery } from "@/types/interaction";

/** Range is measured at the resident's feet; a different floor is never in range. */
export function nearestInteractable(position: InteractionPosition, targets: readonly BuildingInteractable[], visible: VisibilityQuery) {
  let nearest: BuildingInteractable | null = null;
  let nearestDistance = Infinity;
  for (const target of targets) {
    const { building } = target;
    const anchor = building.interactionAnchor;
    const dx = position.x - anchor.position[0], dz = position.z - anchor.position[2];
    const distance = dx * dx + dz * dz;
    if (distance > anchor.radius * anchor.radius || distance >= nearestDistance) continue;
    if (Math.abs(position.y - playerConfig.centerHeight - anchor.position[1]) > interactionConfig.verticalTolerance) continue;
    // Stay on the entrance side of the facade, including around narrow corners.
    const localZ = (position.x - building.position[0]) * Math.sin(building.rotation)
      + (position.z - building.position[2]) * Math.cos(building.rotation);
    if (localZ < building.size[2] / 2 + .1 || !visible(target)) continue;
    nearest = target;
    nearestDistance = distance;
  }
  return nearest;
}

export function locationAt(position: InteractionPosition, targets: readonly BuildingInteractable[]) {
  let location: BuildingInteractable | null = null;
  let nearestDistance = Infinity;
  for (const target of targets) {
    const [x, , z] = target.building.interactionAnchor.position;
    const distance = (position.x - x) ** 2 + (position.z - z) ** 2;
    if (distance < target.locationRadius ** 2 && distance < nearestDistance) {
      nearestDistance = distance; location = target;
    }
  }
  if (location) return location.building.name;
  return Math.hypot(position.x, position.z) <= worldConfig.square.radius + 1
    ? interactionConfig.squareName : interactionConfig.outskirtsName;
}
