import { buildingInteractables } from "@/data/building-interactions";
import { useGameStore } from "@/stores/game-store";
import { useInteractionStore } from "@/stores/interaction-store";
import { locationAt, nearestInteractable } from "./selection";
import type { PlayerRuntime } from "@/types/player";
import type { VisibilityQuery } from "@/types/interaction";
import { npcs } from "@/data/npcs";
import { nearestNpc, type NpcVisibilityQuery } from "./npc-selection";
import { useDialogueStore } from "@/stores/dialogue-store";

/** One entry point for keyboard and touch. A request always rechecks current geometry. */
export function updateWorldInteractions(runtime: PlayerRuntime, visible: VisibilityQuery, visibleNpc: NpcVisibilityQuery, now: number) {
  const game = useGameStore.getState();
  const request = runtime.interactionRequested;
  runtime.interactionRequested = false;
  const interactions = useInteractionStore.getState();
  const blocked = !game.gameStarted || game.gamePaused || game.activePanel !== null || now < interactions.cooldownUntil;
  let target = blocked ? null : nearestInteractable(runtime.position, buildingInteractables, visible);
  let npc = blocked ? null : nearestNpc(runtime.position, npcs, visibleNpc);
  if (target && npc) {
    const anchor = target.building.interactionAnchor.position, position = runtime.position;
    const buildingDistance = (position.x - anchor[0]) ** 2 + (position.z - anchor[2]) ** 2;
    const npcDistance = (position.x - npc.position[0]) ** 2 + (position.z - npc.position[2]) ** 2;
    if (npcDistance < buildingDistance) target = null; else npc = null;
  }
  interactions.publish(target?.id ?? null, locationAt(runtime.position, buildingInteractables), npc?.id ?? null);
  if (request && runtime.input.focused && !blocked) {
    if (npc) useDialogueStore.getState().start(npc.id, now);
    else if (target) interactions.open(target.id, now);
  }
}
