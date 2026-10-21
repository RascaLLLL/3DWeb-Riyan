import type { NpcId } from "./npc";
import type { BuildingId } from "./world";

export type QuestId = "meet-guide" | "guild-records" | "tools-of-trade" | "pages-of-past" | "message-beyond";
export type QuestStatus = "not-started" | "active" | "completed";
export type QuestObjective =
  | { objectiveType: "talk-to-npc"; targetId: NpcId }
  | { objectiveType: "open-building"; targetId: BuildingId };
export type QuestDefinition = QuestObjective & {
  id: QuestId;
  title: string;
  description: string;
  instruction: string;
  discovery: string;
  location: BuildingId | "square";
};
export interface ExplorationProgress {
  completedObjectives: QuestId[];
  selectedObjective: QuestId | null;
}
export type QuestRecord = QuestDefinition & { status: QuestStatus };
export type ExplorationEvent =
  | { type: "npc-talked"; targetId: NpcId }
  | { type: "building-opened"; targetId: BuildingId };
