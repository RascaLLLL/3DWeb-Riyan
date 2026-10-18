import { worldConfig } from "./world";
import type { BuildingId } from "@/types/world";
import type { BuildingInteractable, BuildingPresentation } from "@/types/interaction";

// IDs and section associations come from the world layout, never from UI labels.
export const buildingPresentations: Record<BuildingId, BuildingPresentation> = {
  cottage: { title: "The Cottage", purpose: "About Me", signTitle: "THE COTTAGE" },
  guild: { title: "Adventurer’s Guild", purpose: "Featured Projects", signTitle: "ADVENTURER’S GUILD" },
  forge: { title: "Blacksmith Forge", purpose: "Skills & Technologies", signTitle: "BLACKSMITH FORGE" },
  library: { title: "Grand Library", purpose: "Experience, Education & Certifications", signTitle: "GRAND LIBRARY" },
  gate: { title: "Kingdom Gate", purpose: "Contact & Social Links", signTitle: "KINGDOM GATE" },
};

export const buildingInteractables: BuildingInteractable[] = worldConfig.buildings.map((building) => ({
  id: building.id, building, locationRadius: 8,
}));

export const interactionConfig = {
  eyeHeight: 1.35,
  verticalTolerance: 1.25,
  closeDurationMs: 180,
  reopenDelayMs: 350,
  squareName: "Village Square",
  outskirtsName: "Village Lanes",
} as const;
