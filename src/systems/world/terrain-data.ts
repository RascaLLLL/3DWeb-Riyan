import { Color } from "three";
import { worldConfig } from "@/data/world";
import { seededRandom, terrainHeight } from "./landscape";

/** The visible surface and the Rapier trimesh use these exact same vertices. */
export function createTerrainData() {
  const { radius, segments, depth } = worldConfig.terrain;
  const positions: number[] = [], colors: number[] = [], random = seededRandom(932);
  const palette = ["#819b5e", "#839e61", "#7f9859", "#8ca567", "#7b9556"].map((hex) => new Color(hex));
  const earth = new Color("#80684b"), rings = 11;
  const point = (ring: number, segment: number): [number, number, number] => {
    const angle = segment / segments * Math.PI * 2;
    const r = radius * ring / rings * (1 + .025 * Math.sin(angle * 5) + .018 * Math.cos(angle * 9));
    const x = Math.sin(angle) * r, z = Math.cos(angle) * r;
    return [x, terrainHeight(x, z), z];
  };
  const triangle = (a: number[], b: number[], c: number[], color: Color) => {
    positions.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) colors.push(color.r, color.g, color.b);
  };
  for (let ring = 0; ring < rings; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const a = point(ring, segment), b = point(ring + 1, segment), c = point(ring + 1, segment + 1), d = point(ring, segment + 1);
      triangle(a, b, c, palette[Math.floor(random() * palette.length)]);
      if (ring > 0) triangle(a, c, d, palette[Math.floor(random() * palette.length)]);
    }
  }
  for (let i = 0; i < segments; i++) {
    const a = point(rings, i), b = point(rings, i + 1);
    const c = [a[0] * .95, -depth, a[2] * .95], d = [b[0] * .95, -depth, b[2] * .95];
    triangle(a, c, b, earth); triangle(b, c, d, earth);
  }
  return { positions: new Float32Array(positions), colors: new Float32Array(colors),
    indices: Uint32Array.from({ length: positions.length / 3 }, (_, index) => index) };
}
