"use client";

import { questsById } from "@/data/quests";
import { useGuidanceStore } from "@/stores/guidance-store";
import { useQuestStore } from "@/stores/quest-store";

export function useWalkingDestination() {
  const marked = useGuidanceStore((state) => state.destination);
  const selected = useQuestStore((state) => state.selectedObjective);
  const location = selected ? questsById[selected].location : null;
  return marked ?? (location && location !== "square" ? location : null);
}
