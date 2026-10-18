import type { BuildingDefinition, BuildingId } from "./world";

export interface BuildingPresentation {
  title: string;
  purpose: string;
  signTitle: string;
}

export interface BuildingInteractable {
  id: BuildingId;
  building: BuildingDefinition;
  locationRadius: number;
}

export interface InteractionPosition { x: number; y: number; z: number }
export type VisibilityQuery = (target: BuildingInteractable) => boolean;
export type BuildingPanelPhase = "closed" | "open" | "closing";
