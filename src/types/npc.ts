import type { BuildingId, Vec3 } from "./world";

export type NpcId = "alden" | "elara" | "borin" | "lyra" | "rowan";
export type NpcAppearanceId = "elder" | "keeper" | "smith" | "scholar" | "gatekeeper";
export type DialogueTreeId = "village-guide" | "guild-keeper" | "forge-master" | "archivist" | "gatekeeper";

export interface NpcAppearance {
  reference: `procedural:${NpcAppearanceId}`;
  variant: NpcAppearanceId;
  tunic: string;
  accent: string;
  skin: string;
  hair: string;
  scale: Vec3;
}

export interface NpcAnimationDefinitions {
  idle: { breathing: number; sway: number; frequency: number };
  talking: { gesture: number; frequency: number };
  turnSpeed: number;
  wave: boolean;
}

export interface NpcDefinition {
  id: NpcId;
  displayName: string;
  role: string;
  position: Vec3;
  rotation: number;
  appearance: NpcAppearance;
  animations: NpcAnimationDefinitions;
  dialogueTreeId: DialogueTreeId;
  interactionRange: number;
  associatedDestination: BuildingId | "square";
}
