import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// The configuration only imports types. Transpile it in memory so this check also
// runs on the project's Node 20 floor, without an additional TS runtime package.
const source = await readFile(new URL("../src/data/world.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
const { worldConfig: world } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`);

function insideObstacle(point, obstacle, padding = 0) {
  const x = point[0] - obstacle.center[0], z = point[2] - obstacle.center[2];
  const c = Math.cos(obstacle.rotation), s = Math.sin(obstacle.rotation);
  return Math.abs(x * c - z * s) < obstacle.halfExtents[0] + padding
    && Math.abs(point[1] - obstacle.center[1]) < obstacle.halfExtents[1]
    && Math.abs(x * s + z * c) < obstacle.halfExtents[2] + padding;
}

test("all five landmarks have unique identities, portfolio associations, and finite transforms", () => {
  assert.deepEqual(new Set(world.buildings.map((b) => b.id)), new Set(["cottage", "guild", "forge", "library", "gate"]));
  const obstacleIds = [];
  for (const building of world.buildings) {
    assert.ok(building.name && building.portfolioSections.length > 0);
    assert.ok(building.portfolioHref.startsWith("/portfolio#"));
    assert.ok([...building.position, building.rotation, ...building.interactionAnchor.position].every(Number.isFinite));
    assert.ok(building.size.every((v) => v > 0));
    for (const obstacle of building.collisions) {
      obstacleIds.push(obstacle.id);
      assert.ok(obstacle.halfExtents.every((v) => v > 0));
      assert.ok([...obstacle.center, obstacle.rotation].every(Number.isFinite));
    }
  }
  assert.equal(new Set(obstacleIds).size, obstacleIds.length);
});

test("every landmark has a road from the square through its interaction approach", () => {
  assert.equal(world.roads.length, world.buildings.length);
  for (const building of world.buildings) {
    const roads = world.roads.filter((r) => r.destination === building.id);
    assert.equal(roads.length, 1);
    const road = roads[0];
    assert.deepEqual(road.points[0], [world.square.center[0], world.square.center[2]]);
    assert.ok(road.width >= 2.8);
    assert.ok(road.points.some(([x, z]) => Math.hypot(x - building.interactionAnchor.position[0], z - building.interactionAnchor.position[2]) < .01));
    assert.ok(road.points.flat().every(Number.isFinite));
    for (let i = 1; i < road.points.length; i++) assert.ok(Math.hypot(road.points[i][0] - road.points[i - 1][0], road.points[i][1] - road.points[i - 1][1]) > .1);
  }
});

test("spawn and interaction anchors avoid building obstacle interiors", () => {
  const obstacles = world.buildings.flatMap((b) => b.collisions);
  const points = [world.spawn.position, ...world.buildings.map((b) => b.interactionAnchor.position)];
  for (const point of points) {
    const atResidentHeight = [point[0], 1, point[2]];
    assert.ok(!obstacles.some((o) => insideObstacle(atResidentHeight, o)), `Blocked approach: ${point}`);
  }
});

test("the gate reserves an open entrance below its lintel", () => {
  const gate = world.buildings.find((b) => b.id === "gate");
  assert.ok(gate.collisions.some((o) => o.id === "gate-lintel"));
  for (const x of [-1.5, 0, 1.5]) {
    assert.ok(!gate.collisions.some((o) => insideObstacle([gate.position[0] + x, 1, gate.position[2]], o, .3)));
  }
});
