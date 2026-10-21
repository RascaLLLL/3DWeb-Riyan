"use client";

import { buildingPresentations } from "@/data/building-interactions";
import { useInteractionStore } from "@/stores/interaction-store";
import { useGameStore } from "@/stores/game-store";
import { requestInteraction } from "@/systems/player/motion";
import type { PlayerRuntimeRef } from "@/types/player";
import { npcsById } from "@/data/npcs";

export function ProximityPrompt({ runtime }: { runtime: PlayerRuntimeRef }) {
  const id = useInteractionStore((state) => state.nearbyId);
  const npcId = useInteractionStore((state) => state.nearbyNpcId);
  const blocked = useGameStore((state) => state.gamePaused || state.activePanel !== null);
  const presentation = id ? buildingPresentations[id] : null;
  const npc = npcId ? npcsById[npcId] : null;
  return <div className="proximity-prompt" role="status" aria-live="polite" aria-atomic="true">
    {(presentation || npc) && !blocked && <button className="entrance-prompt" onClick={() => requestInteraction(runtime.current)}>
      <span className="entrance-key" aria-hidden="true">E</span>
      <span><strong>{npc?.displayName ?? presentation?.title}</strong><small>{npc ? "Press E to speak" : "Press E to enter"}</small></span>
    </button>}
  </div>;
}
