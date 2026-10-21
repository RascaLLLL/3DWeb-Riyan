"use client";

import { buildingPresentations } from "@/data/building-interactions";
import { useGuidanceStore } from "@/stores/guidance-store";
import { questStore, useQuestStore } from "@/stores/quest-store";
import { questsById } from "@/data/quests";
import { useWalkingDestination } from "@/hooks/use-walking-destination";

export function DestinationGuidance() {
  const destination = useWalkingDestination();
  const marked = useGuidanceStore((state) => state.destination);
  const selected = useQuestStore((state) => state.selectedObjective);
  const objective = selected ? questsById[selected] : null;
  if (!destination && !objective) return null;
  return <aside className="destination-guidance" aria-label="Walking destination">
    <span className="location-caption">{objective && !marked ? "Optional discovery" : "Path marked"}</span><strong>{objective && !marked ? objective.title : destination && buildingPresentations[destination].title}</strong>
    <p>{objective && !marked ? objective.instruction : "Follow the gold landmark."}</p><button onClick={() => {
      useGuidanceStore.getState().highlight(null); questStore.getState().selectObjective(null);
    }}>Clear directions</button>
  </aside>;
}
