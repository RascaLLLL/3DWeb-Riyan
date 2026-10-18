import type { DialogueTreeId, NpcId } from "./npc";
import type { BuildingId } from "./world";

export type DiscoveryObjectiveId = "meet-guide";
export type DialogueExpression = "warm" | "thoughtful" | "cheerful" | "calm";
export type DialogueAction =
  | { type: "open-panel"; destination: BuildingId }
  | { type: "highlight-destination"; destination: BuildingId }
  | { type: "complete-objective"; objective: DiscoveryObjectiveId }
  | { type: "close" }
  | { type: "branch"; treeId: DialogueTreeId; nodeId?: string };

export interface DialogueChoice { id: string; label: string; next?: string; action?: DialogueAction }
export interface DialogueNode {
  id: string;
  speaker: NpcId;
  text: string;
  expression?: DialogueExpression;
  choices?: DialogueChoice[];
  next?: string;
  action?: DialogueAction;
}
export interface DialogueTree {
  id: DialogueTreeId;
  npcId: NpcId;
  entry: string;
  nodes: Record<string, DialogueNode>;
}
export type DialogueCatalog = Record<DialogueTreeId, DialogueTree>;
export interface DialogueSession { npcId: NpcId; treeId: DialogueTreeId; nodeId: string; turn: number }
export type DialogueInput = { type: "continue" } | { type: "choice"; id: string };
export type DialogueEffect = Exclude<DialogueAction, { type: "branch" } | { type: "close" }>;
export interface DialogueResult { session: DialogueSession | null; effects: DialogueEffect[]; error?: string }
