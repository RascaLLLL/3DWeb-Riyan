import { quests, questsById } from "@/data/quests";
import type { ExplorationEvent, ExplorationProgress, QuestDefinition, QuestId, QuestRecord } from "@/types/quest";

export function isQuestId(value: unknown): value is QuestId {
  return typeof value === "string" && Object.hasOwn(questsById, value);
}

export function initialExplorationProgress(): ExplorationProgress {
  return { completedObjectives: [], selectedObjective: "meet-guide" };
}

// Only known IDs survive hydration. Counts and statuses are always derived.
export function readExplorationProgress(value: unknown): ExplorationProgress {
  if (!value || typeof value !== "object") return initialExplorationProgress();
  const saved = value as Record<string, unknown>;
  const completedObjectives = Array.isArray(saved.completedObjectives)
    ? [...new Set(saved.completedObjectives.filter(isQuestId))] : [];
  const selected = saved.selectedObjective;
  const selectedObjective = selected === null ? null : isQuestId(selected) ? selected : "meet-guide";
  return { completedObjectives, selectedObjective: selectedObjective && !completedObjectives.includes(selectedObjective) ? selectedObjective : null };
}

export function matchesObjective(quest: QuestDefinition, event: ExplorationEvent): boolean {
  return quest.targetId === event.targetId && (
    (quest.objectiveType === "talk-to-npc" && event.type === "npc-talked") ||
    (quest.objectiveType === "open-building" && event.type === "building-opened")
  );
}

export function progressAfterEvent(progress: ExplorationProgress, event: ExplorationEvent): ExplorationProgress {
  const discovered = quests.filter((quest) => matchesObjective(quest, event) && !progress.completedObjectives.includes(quest.id));
  if (!discovered.length) return progress;
  const completedObjectives = [...progress.completedObjectives, ...discovered.map((quest) => quest.id)];
  return { completedObjectives, selectedObjective: progress.selectedObjective && completedObjectives.includes(progress.selectedObjective) ? null : progress.selectedObjective };
}

export function questRecords(progress: ExplorationProgress): QuestRecord[] {
  return quests.map((quest) => ({ ...quest, status: progress.completedObjectives.includes(quest.id) ? "completed" : progress.selectedObjective === quest.id ? "active" : "not-started" }));
}
