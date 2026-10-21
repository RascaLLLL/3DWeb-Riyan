import { worldConfig } from "@/data/world";
import { npcsById } from "@/data/npcs";
import type { QuestDefinition } from "@/types/quest";
import type { Vec2, Vec3 } from "@/types/world";

export const mapSize = 600;
const margin = 20;
export const mapScale = (mapSize - margin * 2) / (worldConfig.terrain.radius * 2);

// North is -Z. The SVG Y axis grows south, matching world Z.
export function worldToMap(x: number, z: number): Vec2 {
  return [mapSize / 2 + x * mapScale, mapSize / 2 + z * mapScale];
}

export function questPosition(quest: QuestDefinition): Vec3 {
  if (quest.objectiveType === "talk-to-npc") return npcsById[quest.targetId].position;
  return worldConfig.buildings.find((building) => building.id === quest.targetId)!.interactionAnchor.position;
}

export function questLocationName(quest: QuestDefinition): string {
  return quest.location === "square" ? "Village Square" : worldConfig.buildings.find((building) => building.id === quest.location)!.name;
}

export function mapRotation(yaw: number): number { return -yaw * 180 / Math.PI; }
