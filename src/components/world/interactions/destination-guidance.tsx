"use client";

import { buildingPresentations } from "@/data/building-interactions";
import { useGuidanceStore } from "@/stores/guidance-store";
import { questStore, useQuestStore } from "@/stores/quest-store";
import { questsById } from "@/data/quests";
import { useWalkingDestination } from "@/hooks/use-walking-destination";
import { openExplorationPanel } from "@/systems/exploration/panels";
import { useGameStore } from "@/stores/game-store";
import { InterfaceIcon } from "@/components/ui/interface-icon";

export function DestinationGuidance() {
  const destination = useWalkingDestination();
  const marked = useGuidanceStore((state) => state.destination);
  const selected = useQuestStore((state) => state.selectedObjective);
  const objective = selected ? questsById[selected] : null;
  const blocked = useGameStore((state) => state.activePanel !== null || !state.gameStarted);
  if (!destination && !objective) return null;
  const title = objective && !marked ? objective.title : destination ? buildingPresentations[destination].title : "Walking destination";
  return <aside className="destination-guidance" aria-label="Walking destination">
    <button className="guidance-map-link" aria-disabled={blocked} title={title} onClick={() => openExplorationPanel("map")}
      aria-label={`View ${title} on the village map`}>
      <span className="location-caption">{objective && !marked ? "Current objective" : "Walking to"}</span><strong>{title}</strong>
    </button><button className="guidance-clear" disabled={blocked} aria-label="Clear walking directions and stop tracking" title="Clear walking guidance" onClick={() => {
      useGuidanceStore.getState().highlight(null); questStore.getState().selectObjective(null);
    }}><InterfaceIcon name="close" /></button>
  </aside>;
}
