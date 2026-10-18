import type { BuildingDefinition, BuildingId, PropDefinition, RoadDefinition, StaticObstacle, Vec3 } from "@/types/world";

// All world-space placement lives here. Geometry builders use local coordinates.
export function localToWorld(local: Vec3, origin: Vec3, yaw: number): Vec3 {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  return [origin[0] + local[0] * c + local[2] * s, origin[1] + local[1], origin[2] - local[0] * s + local[2] * c];
}

function building(
  id: BuildingId, name: string, position: Vec3, rotation: number, size: Vec3,
  roof: BuildingDefinition["roof"], portfolioSections: BuildingDefinition["portfolioSections"],
  portfolioHref: string, description: string,
): BuildingDefinition {
  const [width, height, depth] = size;
  const obstacle = (suffix: string, center: Vec3, halfExtents: Vec3): StaticObstacle => ({
    id: `${id}-${suffix}`, center: localToWorld(center, position, rotation), halfExtents, rotation, kind: "building",
  });
  const collisions: StaticObstacle[] = id === "gate"
    ? [-1, 1].map((side) => obstacle(`tower-${side}`, [side * 4.6, 3.1, 0], [1.6, 3.1, 1.7]))
    : [obstacle("body", [0, height / 2, 0], [width / 2, height / 2, depth / 2])];
  if (id === "gate") collisions.push(obstacle("lintel", [0, 5.5, 0], [3.1, .6, 1.25]));
  if (id === "library") collisions.push(obstacle("tower", [width / 2 + 1.1, 4.1, -.7], [1.7, 4.1, 1.7]));
  if (id === "guild") for (const x of [-1.2, 1.2]) collisions.push(obstacle(`porch-${x}`, [x, 1.4, depth / 2 + 1.53], [.1, 1.4, .1]));
  if (id === "forge") {
    for (const x of [-width / 2, width / 2]) collisions.push(obstacle(`post-${x}`, [x, 1.5, depth / 2 + 3.33], [.12, 1.5, .12]));
    collisions.push(obstacle("hearth", [-2, .7, depth / 2 + 1.33], [1, .7, .7]));
    collisions.push(obstacle("anvil", [1.4, .8, depth / 2 + 1.93], [1, .8, .5]));
  }
  return { id, name, position, rotation, size, roof, interactionAnchor: { position: localToWorld([0, 0, depth / 2 + 2], position, rotation), radius: 2 }, collisions, portfolioSections, portfolioHref, description };
}

const buildings: BuildingDefinition[] = [
  building("cottage", "Player Cottage", [-16, 0, 8], 2.03, [6, 3.6, 5], "sageRoof", ["about"], "/portfolio#about", "A small timber home with a moss-green roof and a flower garden."),
  building("guild", "Adventurer’s Guild", [-14, 0, -12], .74, [8.2, 5.3, 6], "terracotta", ["projects"], "/portfolio#projects", "The red-roofed guild hall, marked by a hanging shield and quest board."),
  building("forge", "Blacksmith Forge", [16, 0, 5], -1.88, [7, 3.8, 5.5], "darkRoof", ["skills"], "/portfolio#skills", "A charcoal-roofed workshop with an open forge, anvil, and stone chimney."),
  building("library", "Grand Library", [11, 0, -16], -.5, [8, 6, 6], "slate", ["experience", "education", "certifications"], "/portfolio#experience", "The tall slate-roofed library with an adjoining round tower."),
  building("gate", "Kingdom Gate", [0, 0, 26], Math.PI, [12.4, 6, 3.4], "slate", ["contact"], "/portfolio#contact", "Twin stone towers frame the southern road into the village."),
];

const roadBends: Record<BuildingId, [number, number][]> = {
  cottage: [[-8, 4]], guild: [[-.5, -4], [-7, -6]], forge: [[8, 3]], library: [[5, -8]], gate: [[0, 13]],
};
const roads: RoadDefinition[] = buildings.map((entry) => ({
  id: `road-${entry.id}`, destination: entry.id,
  points: [[0, 0], ...roadBends[entry.id], [entry.interactionAnchor.position[0], entry.interactionAnchor.position[2]],
    // Continue from the approach anchor to the threshold (through the gate arch).
    [localToWorld([0, 0, entry.id === "gate" ? -6 : entry.size[2] / 2], entry.position, entry.rotation)[0],
      localToWorld([0, 0, entry.id === "gate" ? -6 : entry.size[2] / 2], entry.position, entry.rotation)[2]]],
  width: entry.id === "gate" ? 4.4 : 2.8,
  surface: entry.id === "cottage" || entry.id === "forge" ? "dirt" : "cobblestone",
}));

const props: PropDefinition[] = [
  { id: "square-well", kind: "well", position: [-3.6, 0, -.8], rotation: .12 },
  { id: "square-board", kind: "noticeBoard", position: [0, 0, -5.7], rotation: 0 },
  { id: "bench-west", kind: "bench", position: [-5.8, 0, 4.2], rotation: -.65 },
  { id: "bench-north", kind: "bench", position: [-3, 0, -5.7], rotation: .3 },
  { id: "lantern-south", kind: "lantern", position: [-3.1, 0, 7.5], rotation: .2 },
  { id: "lantern-east", kind: "lantern", position: [6.3, 0, -.6], rotation: -1.5 },
  { id: "lantern-guild", kind: "lantern", position: [-7.3, 0, -10.5], rotation: .5 },
  { id: "lantern-library", kind: "lantern", position: [6.4, 0, -11.5], rotation: -.5 },
  { id: "market-ochre", kind: "stall", position: [6.4, 0, 7.8], rotation: -.55, variant: 0 },
  { id: "market-green", kind: "stall", position: [8.6, 0, -3.7], rotation: -1.4, variant: 1 },
  { id: "market-barrel", kind: "barrel", position: [4.9, 0, 10], rotation: 0 },
  { id: "market-crate", kind: "crate", position: [8.3, 0, 10], rotation: .2 },
  { id: "market-cart", kind: "cart", position: [-8, 0, 10.8], rotation: 1.1 },
  { id: "guild-barrel-1", kind: "barrel", position: [-16, 0, -6.8], rotation: 0 },
  { id: "guild-barrel-2", kind: "barrel", position: [-17, 0, -6.9], rotation: .2 },
  { id: "forge-crate", kind: "crate", position: [12.1, 0, 8.4], rotation: -.2 },
  { id: "forge-barrel", kind: "barrel", position: [12, 0, 9.8], rotation: 0 },
  { id: "cottage-hay-1", kind: "hay", position: [-18.5, 0, 12], rotation: .2 },
  { id: "cottage-hay-2", kind: "hay", position: [-18.5, .7, 12], rotation: .2 },
  ...[-22, -19, -16, -13].map((x, i) => ({ id: `cottage-fence-${i}`, kind: "fence" as const, position: [x, 0, 15] as Vec3, rotation: 0 })),
  ...[-10, -7, 7, 10].map((x, i) => ({ id: `gate-fence-${i}`, kind: "fence" as const, position: [x, 0, 26] as Vec3, rotation: 0 })),
];

export const worldConfig = {
  id: "riyan-village",
  terrain: { radius: 38, segments: 56, depth: 2.8, groundY: 0, flatRadius: 27 },
  scenery: { seed: 1729, radius: 35.7, spacing: 3.6, boundaryRadius: 35, boundarySegments: 38, boundarySeed: 811 },
  square: { center: [0, 0, 0] as Vec3, radius: 7.2 },
  spawn: { position: [0, .18, 2.2] as Vec3, rotation: Math.PI },
  camera: { position: [42, 42, 51] as Vec3, target: [0, -3, 0] as Vec3, fov: 43, far: 600, minDistance: 13, maxDistance: 100 },
  lighting: { sunPosition: [-25, 42, 25] as Vec3, sky: "#becbc1", fogNear: 68, fogFar: 145 },
  buildings, roads, props,
} as const;
