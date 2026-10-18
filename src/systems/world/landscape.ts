import { worldConfig } from "@/data/world";
import type { NaturePlacement, StaticObstacle, Vec2, Vec3 } from "@/types/world";
import { PartBuilder } from "./part-builder";

export function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function terrainHeight(x: number, z: number) {
  const radius = Math.hypot(x, z);
  const { flatRadius } = worldConfig.terrain;
  if (radius <= flatRadius) return 0;
  const edge = Math.min(1, (radius - flatRadius) / (worldConfig.terrain.radius - flatRadius));
  return edge * edge * (1.6 + Math.sin(x * .23) * .6 + Math.cos(z * .27) * .5);
}

function distanceToSegment(point: Vec2, from: Vec2, to: Vec2) {
  const dx = to[0] - from[0], dz = to[1] - from[1];
  const lengthSquared = dx * dx + dz * dz;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((point[0] - from[0]) * dx + (point[1] - from[1]) * dz) / lengthSquared));
  return Math.hypot(point[0] - from[0] - t * dx, point[1] - from[1] - t * dz);
}

export function isClearForNature(x: number, z: number, margin = 1.8) {
  if (Math.hypot(x, z) < worldConfig.square.radius + margin) return false;
  for (const building of worldConfig.buildings) {
    if (Math.hypot(x - building.position[0], z - building.position[2]) < Math.hypot(building.size[0], building.size[2]) / 2 + margin + 1.4) return false;
  }
  for (const prop of worldConfig.props) {
    if (Math.hypot(x - prop.position[0], z - prop.position[2]) < margin + 2.2) return false;
  }
  return worldConfig.roads.every((road) => road.points.slice(1).every((to, index) => distanceToSegment([x, z], road.points[index], to) > road.width / 2 + margin));
}

export function createNaturePlacements(): NaturePlacement[] {
  const random = seededRandom(worldConfig.scenery.seed);
  const { radius, spacing } = worldConfig.scenery;
  const result: NaturePlacement[] = [];
  for (let x = -radius + 2; x <= radius - 2; x += spacing) {
    for (let z = -radius + 2; z <= radius - 2; z += spacing) {
      const px = x + (random() - .5) * 2.6, pz = z + (random() - .5) * 2.6;
      if (Math.hypot(px, pz) > radius || !isClearForNature(px, pz)) continue;
      const kind = Math.hypot(px, pz) > 29 ? (random() > .35 ? "pine" : "oak")
        : random() > .52 ? "oak" : random() > .5 ? "bush" : "rock";
      result.push({ id: `nature-${result.length}`, kind, position: [px, terrainHeight(px, pz), pz], scale: .75 + random() * .65, rotation: random() * Math.PI * 2 });
    }
  }
  // Small flower beds may sit closer to roads than solid tree obstacles.
  for (let i = 0; i < 140; i++) {
    const x = (random() - .5) * 60, z = (random() - .5) * 60;
    if (Math.hypot(x, z) > 32 || !isClearForNature(x, z, .25)) continue;
    result.push({ id: `flowers-${i}`, kind: "flowers", position: [x, terrainHeight(x, z), z], scale: .8 + random() * .5, rotation: random() * 6 });
  }
  return result;
}

export function buildNature(placements: NaturePlacement[]) {
  const result = new PartBuilder();
  for (const item of placements) {
    const b = new PartBuilder(), s = item.scale;
    switch (item.kind) {
      case "pine":
        b.add("cylinder", "timber", [0, 1.7 * s, 0], [.18 * s, 3.4 * s, .18 * s]);
        for (let i = 0; i < 3; i++) b.add("cone", i % 2 ? "leaf" : "pine", [0, (2.2 + i * 1.05) * s, 0], [(1.65 - i * .32) * s, 2.7 * s, (1.65 - i * .32) * s]);
        break;
      case "oak":
        b.add("cylinder", "timber", [0, 1.7 * s, 0], [.22 * s, 3.4 * s, .22 * s]);
        b.beam("timber", [0, 2 * s, 0], [1 * s, 3.5 * s, .2 * s], .18 * s);
        b.add("sphere", "leaf", [0, 4 * s, 0], [2 * s, 2.2 * s, 1.8 * s]);
        b.add("sphere", "leafLight", [1.1 * s, 3.7 * s, .3 * s], [1.5 * s, 1.6 * s, 1.45 * s]);
        break;
      case "bush":
        b.add("sphere", "leaf", [0, .5 * s, 0], [1 * s, .75 * s, .85 * s]);
        b.add("sphere", "leafLight", [.6 * s, .4 * s, .2], [.65 * s, .5 * s, .6 * s]);
        break;
      case "rock":
        b.add("rock", "stone", [0, .4 * s, 0], [.85 * s, .65 * s, .7 * s]);
        b.add("rock", "stoneLight", [.6 * s, .16 * s, .3], [.35 * s, .3 * s, .4 * s]);
        break;
      case "flowers":
        for (let i = 0; i < 7; i++) {
          const angle = i * 2.4, r = .15 + i * .1;
          const x = Math.sin(angle) * r, z = Math.cos(angle) * r;
          b.box("leaf", [x, .18 * s, z], [.035, .36 * s, .035]);
          b.add("sphere", i % 3 ? "flowerGold" : "flower", [x, .4 * s, z], [.12 * s, .085 * s, .12 * s]);
        }
        break;
    }
    result.place(b.parts, item.position, item.rotation);
  }
  return result.parts;
}

export function buildPaths() {
  const b = new PartBuilder(), random = seededRandom(42);
  const radius = worldConfig.square.radius;
  b.add("cylinder", "path", [0, .045, 0], [radius + .2, .09, radius + .2]);
  for (let x = -radius; x < radius; x += .63) {
    for (let z = -radius; z < radius; z += .62) {
      const px = x + (Math.round(z / .62) % 2 ? .3 : 0);
      if (Math.hypot(px, z) < radius - .1) b.box(random() > .55 ? "cobble" : "cobbleLight", [px, .1, z], [.56 + random() * .03, .1, .53 + random() * .04], [0, (random() - .5) * .07, 0]);
    }
  }
  for (const road of worldConfig.roads) {
    for (let segment = 1; segment < road.points.length; segment++) {
      const from = road.points[segment - 1], to = road.points[segment];
      const dx = to[0] - from[0], dz = to[1] - from[1], length = Math.hypot(dx, dz), yaw = Math.atan2(dx, dz);
      const mx = (from[0] + to[0]) / 2, mz = (from[1] + to[1]) / 2;
      b.box("path", [mx, .035, mz], [road.width + .35, .07, length + .35], [0, yaw, 0]);
      if (road.surface === "dirt") continue;
      const rows = Math.ceil(length / .64), columns = Math.floor(road.width / .58);
      for (let row = 0; row <= rows; row++) {
        for (let column = 0; column < columns; column++) {
          const across = (column - (columns - 1) / 2) * .59;
          const along = Math.min(length, row * .64);
          const x = from[0] + dx / length * along + Math.cos(yaw) * across;
          const z = from[1] + dz / length * along - Math.sin(yaw) * across;
          if (Math.hypot(x, z) < radius - .2) continue;
          b.box(random() > .5 ? "cobble" : "cobbleLight", [x, .1, z], [.53, .1, .56], [0, yaw + (random() - .5) * .07, 0]);
        }
      }
    }
  }
  return b.parts;
}

export function createBoundaryPlacements() {
  const { boundaryRadius, boundarySegments, boundarySeed } = worldConfig.scenery;
  const random = seededRandom(boundarySeed);
  const result: { id: string; position: Vec3; scale: Vec3; rotation: number }[] = [];
  for (let i = 0; i < boundarySegments; i++) {
    const angle = i / boundarySegments * Math.PI * 2;
    if (Math.cos(angle) > .87) continue;
    const x = Math.sin(angle) * boundaryRadius, z = Math.cos(angle) * boundaryRadius;
    result.push({ id: `boundary-${i}`, position: [x, terrainHeight(x, z) - .2, z], scale: [3.8 + random() * 2, 2.5 + random() * 3, 3.8], rotation: angle });
  }
  return result;
}

export function buildLandscapeDetails() {
  const b = new PartBuilder(), random = seededRandom(83);
  for (const item of createBoundaryPlacements()) b.add("rock", "ridge", item.position, item.scale, [0, item.rotation, 0]);
  for (let i = 0; i < 90; i++) {
    const x = (random() - .5) * 65, z = (random() - .5) * 65;
    if (Math.hypot(x, z) > 34 || !isClearForNature(x, z, .15)) continue;
    b.add("cylinder", i % 2 ? "grassLight" : "grassDark", [x, terrainHeight(x, z) + .018, z], [1.5 + random() * 2, .025, 1 + random()], [0, random() * 6, 0]);
  }
  return b.parts;
}

const propSizes: Record<string, Vec3> = {
  well: [1.9, 1.7, 1.5], noticeBoard: [1.5, 1.6, .45], bench: [1.3, .8, .5],
  lantern: [.35, 1.9, .35], stall: [1.9, 1.5, 1.3], barrel: [.5, .6, .5],
  crate: [.55, .55, .55], hay: [.8, .4, .5], cart: [1.1, .8, 2.4], fence: [1.6, .8, .2],
};

export function createStaticObstacles(nature: NaturePlacement[]): StaticObstacle[] {
  return [
    ...worldConfig.buildings.flatMap((b) => b.collisions),
    ...worldConfig.props.map((prop): StaticObstacle => {
      const halfExtents = propSizes[prop.kind];
      return { id: prop.id, center: [prop.position[0], prop.position[1] + halfExtents[1], prop.position[2]], halfExtents, rotation: prop.rotation, kind: "prop" };
    }),
    ...nature.filter((p) => p.kind === "pine" || p.kind === "oak" || p.kind === "rock").map((p): StaticObstacle => ({
      id: p.id, center: [p.position[0], p.position[1] + (p.kind === "rock" ? .4 : 1.5) * p.scale, p.position[2]],
      halfExtents: p.kind === "rock" ? [.9 * p.scale, .7 * p.scale, .8 * p.scale] : [.28 * p.scale, 1.5 * p.scale, .28 * p.scale],
      rotation: p.rotation, kind: "nature",
    })),
    ...createBoundaryPlacements().map((item): StaticObstacle => ({ id: item.id, center: item.position, halfExtents: item.scale, rotation: item.rotation, kind: "boundary" })),
  ];
}
