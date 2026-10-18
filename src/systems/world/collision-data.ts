import { worldConfig } from "@/data/world";
import { terrainHeight } from "./landscape";
import type { ScenePart, StaticObstacle } from "@/types/world";

/** Smooth collision surfaces replace hundreds of tiny individual paver edges. */
export function createSurfaceObstacles(): StaticObstacle[] {
  const result: StaticObstacle[] = [];
  for (const road of worldConfig.roads) {
    for (let i = 1; i < road.points.length; i++) {
      const a = road.points[i - 1], b = road.points[i];
      const height = road.surface === "dirt" ? .07 : .15;
      result.push({ id: `${road.id}-${i}`, kind: "prop", center: [(a[0] + b[0]) / 2, height / 2, (a[1] + b[1]) / 2],
        halfExtents: [(road.width + .2) / 2, height / 2, Math.hypot(b[0] - a[0], b[1] - a[1]) / 2 + .1], rotation: Math.atan2(b[0] - a[0], b[1] - a[1]) });
    }
  }
  const count = worldConfig.terrain.segments, radius = worldConfig.terrain.radius - 2.4;
  for (let i = 0; i < count; i++) {
    const yaw = i / count * Math.PI * 2, x = Math.sin(yaw) * radius, z = Math.cos(yaw) * radius;
    result.push({ id: `perimeter-${i}`, kind: "boundary", center: [x, terrainHeight(x, z) + 2, z],
      halfExtents: [radius * Math.tan(Math.PI / count) + .1, 5, .4], rotation: yaw });
  }
  return result;
}

export function createRoofColliders(parts: ScenePart[]) {
  return parts.filter((p) => p.geometry === "roof" && p.material !== "plaster").map((part) => {
    const [w, h, d] = part.scale;
    return { position: part.position, rotation: part.rotation, vertices: new Float32Array([
      -w / 2, 0, -d / 2, w / 2, 0, -d / 2, 0, h, -d / 2,
      -w / 2, 0, d / 2, w / 2, 0, d / 2, 0, h, d / 2,
    ]) };
  });
}
