import { localToWorld, worldConfig } from "./world";
import type { NpcAnimationDefinitions, NpcDefinition, NpcId } from "@/types/npc";
import type { BuildingId, Vec3 } from "@/types/world";

function besideEntrance(id: BuildingId, offset: Vec3): Vec3 {
  const building = worldConfig.buildings.find((entry) => entry.id === id)!;
  return localToWorld([offset[0], offset[1], building.size[2] / 2 + offset[2]], building.position, building.rotation);
}
const animations: NpcAnimationDefinitions = {
  idle: { breathing: .012, sway: .025, frequency: 1.7 },
  talking: { gesture: .22, frequency: 3.4 }, turnSpeed: 4, wave: false,
};

export const npcs: NpcDefinition[] = [
  { id: "alden", displayName: "Elder Alden", role: "Village Guide", position: [-1.8, .15, 1.2], rotation: .9,
    appearance: { reference: "procedural:elder", variant: "elder", tunic: "#7c8062", accent: "#435e50", skin: "#c89d7b", hair: "#ddd5bd", scale: [1, 1, 1] },
    animations: { ...animations, wave: true }, dialogueTreeId: "village-guide", interactionRange: 2.6, associatedDestination: "square" },
  { id: "elara", displayName: "Elara", role: "Guild Keeper", position: besideEntrance("guild", [-1.6, 0, 4]), rotation: .74,
    appearance: { reference: "procedural:keeper", variant: "keeper", tunic: "#54745a", accent: "#b18a4d", skin: "#b9835f", hair: "#75432c", scale: [1, .98, 1] },
    animations, dialogueTreeId: "guild-keeper", interactionRange: 2.5, associatedDestination: "guild" },
  { id: "borin", displayName: "Borin", role: "Blacksmith", position: besideEntrance("forge", [-1.6, 0, 4]), rotation: -1.88,
    appearance: { reference: "procedural:smith", variant: "smith", tunic: "#95836a", accent: "#6b422c", skin: "#bd835c", hair: "#60412e", scale: [1.18, .96, 1.08] },
    animations: { ...animations, talking: { gesture: .15, frequency: 3 } }, dialogueTreeId: "forge-master", interactionRange: 2.5, associatedDestination: "forge" },
  { id: "lyra", displayName: "Lyra", role: "Archivist", position: besideEntrance("library", [-.6, .15, 4.5]), rotation: -.5,
    appearance: { reference: "procedural:scholar", variant: "scholar", tunic: "#526c79", accent: "#9c7956", skin: "#d1a681", hair: "#493d38", scale: [.96, 1.05, .96] },
    animations: { ...animations, talking: { gesture: .12, frequency: 2.5 } }, dialogueTreeId: "archivist", interactionRange: 2.5, associatedDestination: "library" },
  { id: "rowan", displayName: "Rowan", role: "Gatekeeper", position: besideEntrance("gate", [-1.8, .15, 3.8]), rotation: Math.PI,
    appearance: { reference: "procedural:gatekeeper", variant: "gatekeeper", tunic: "#95674b", accent: "#476252", skin: "#b98565", hair: "#5a4031", scale: [1, 1.07, 1] },
    animations: { ...animations, wave: true }, dialogueTreeId: "gatekeeper", interactionRange: 2.5, associatedDestination: "gate" },
];

export const npcsById = Object.fromEntries(npcs.map((npc) => [npc.id, npc])) as Record<NpcId, NpcDefinition>;
