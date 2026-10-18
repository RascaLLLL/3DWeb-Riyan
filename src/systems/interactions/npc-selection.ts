import { playerConfig } from "@/data/player";
import { interactionConfig } from "@/data/building-interactions";
import type { InteractionPosition } from "@/types/interaction";
import type { NpcDefinition } from "@/types/npc";

export type NpcVisibilityQuery = (npc: NpcDefinition) => boolean;
export function nearestNpc(position: InteractionPosition, npcs: readonly NpcDefinition[], visible: NpcVisibilityQuery) {
  let result: NpcDefinition | null = null, best = Infinity;
  for (const npc of npcs) {
    const distance = (position.x - npc.position[0]) ** 2 + (position.z - npc.position[2]) ** 2;
    if (distance > npc.interactionRange ** 2 || distance >= best) continue;
    if (Math.abs(position.y - playerConfig.centerHeight - npc.position[1]) > interactionConfig.verticalTolerance || !visible(npc)) continue;
    result = npc; best = distance;
  }
  return result;
}
