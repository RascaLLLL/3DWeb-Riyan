import assert from "node:assert/strict";
import test, { before, afterEach } from "node:test";
import RAPIER from "@dimforge/rapier3d-compat";
import { Euler, Quaternion } from "three";
import { buildingInteractables, buildingPresentations } from "../src/data/building-interactions";
import { localToWorld } from "../src/data/world";
import { portfolio } from "../src/data/portfolio";
import { playerConfig } from "../src/data/player";
import { nearestInteractable } from "../src/systems/interactions/selection";
import { entranceIsVisible } from "../src/systems/interactions/visibility";
import { updateWorldInteractions } from "../src/systems/interactions/manager";
import { createPlayerRuntime } from "../src/systems/player/motion";
import { createVillageModel } from "../src/systems/world/village-model";
import { useGameStore } from "../src/stores/game-store";
import { useInteractionStore } from "../src/stores/interaction-store";
import type { BuildingInteractable, InteractionPosition } from "../src/types/interaction";
import type { PlayerRuntime } from "../src/types/player";
import type { VisibilityQuery } from "../src/types/interaction";

before(async () => { await RAPIER.init(); });
afterEach(() => { useInteractionStore.getState().reset(); useGameStore.getState().stopGame(); });
const unobstructed = () => true;
const updateBuildingInteractions = (runtime: PlayerRuntime, visible: VisibilityQuery, now: number) => updateWorldInteractions(runtime, visible, () => false, now);
function approach(target: BuildingInteractable, offset = .4): InteractionPosition {
  const b = target.building;
  const [x, y, z] = localToWorld([0, playerConfig.centerHeight + .15, b.size[2] / 2 + 2 + offset], b.position, b.rotation);
  return { x, y, z };
}

test("all five destinations have stable IDs, presentation, and existing HTML sections", () => {
  assert.equal(new Set(buildingInteractables.map((target) => target.id)).size, 5);
  for (const { id, building } of buildingInteractables) {
    assert.ok(buildingPresentations[id].purpose);
    for (const section of building.portfolioSections) assert.ok(portfolio.sections.some((entry) => entry.id === section), `${id}: ${section}`);
    assert.ok(portfolio.sections.some((entry) => building.portfolioHref === `/portfolio#${entry.id}`));
  }
  assert.ok(buildingInteractables.find(({ id }) => id === "library")!.building.portfolioSections.includes("certifications"));
});

test("every entrance is discoverable only within range and at ground level", () => {
  for (const target of buildingInteractables) {
    assert.equal(nearestInteractable(approach(target), buildingInteractables, unobstructed)?.id, target.id);
    assert.equal(nearestInteractable(approach(target, 2.05), buildingInteractables, unobstructed), null);
    const high = approach(target); high.y += 5;
    assert.equal(nearestInteractable(high, buildingInteractables, unobstructed), null);
  }
  assert.equal(nearestInteractable({ x: 0, y: 1.05, z: 2.2 }, buildingInteractables, unobstructed), null);
});

test("overlapping candidates select the nearest visible entrance, independent of order", () => {
  const source = buildingInteractables[0];
  const far = { ...source, building: { ...source.building, position: [0, 0, -5] as [number, number, number], rotation: 0,
    interactionAnchor: { position: [0, 0, 1] as [number, number, number], radius: 2 } } };
  const near = { ...far, id: "guild" as const, building: { ...far.building,
    interactionAnchor: { position: [.1, 0, 0] as [number, number, number], radius: 2 } } };
  const position = { x: 0, y: 1, z: 0 };
  assert.equal(nearestInteractable(position, [far, near], unobstructed), near);
  assert.equal(nearestInteractable(position, [near, far], unobstructed), near);
  assert.equal(nearestInteractable(position, [far, near], (target) => target !== near), far);
  assert.equal(nearestInteractable(position, [far, near], () => false), null);
});

test("real village colliders leave each configured entrance visible and exclude the resident", () => {
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  try {
    const fixed = world.createRigidBody(RAPIER.RigidBodyDesc.fixed()), quaternion = new Quaternion();
    for (const obstacle of createVillageModel().obstacles) {
      quaternion.setFromEuler(new Euler(0, obstacle.rotation, 0));
      world.createCollider(RAPIER.ColliderDesc.cuboid(...obstacle.halfExtents).setTranslation(...obstacle.center).setRotation(quaternion), fixed);
    }
    const player = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased());
    world.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfHeight, playerConfig.radius), player);
    const ray = new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    for (const target of buildingInteractables) {
      const position = approach(target);
      player.setTranslation(position, true); world.step();
      assert.equal(entranceIsVisible(world, ray, position, target, player), true, `${target.id} entrance blocked`);
      assert.equal(entranceIsVisible(world, ray, position, target), false, "the resident otherwise occludes their own ray");
    }
  } finally { world.free(); }
});

test("a solid wall blocks interaction even inside the proximity radius; sensors do not", () => {
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  try {
    const target = buildingInteractables.find(({ id }) => id === "gate")!;
    const position = approach(target, 1.5);
    const [x, , z] = target.building.interactionAnchor.position;
    const wall = world.createCollider(RAPIER.ColliderDesc.cuboid(1, 2, .12).setTranslation((x + position.x) / 2, 2, (z + position.z) / 2));
    world.step();
    const ray = new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
    const query = () => entranceIsVisible(world, ray, position, target);
    assert.equal(nearestInteractable(position, [target], query), null);
    wall.setSensor(true); world.step();
    assert.equal(nearestInteractable(position, [target], query), target);
  } finally { world.free(); }
});

test("requests revalidate range and blocking UI, never opening a stale prompt", () => {
  const runtime = createPlayerRuntime(), target = buildingInteractables[0];
  useGameStore.getState().startGame();
  runtime.position = approach(target);
  updateBuildingInteractions(runtime, unobstructed, 1000);
  assert.equal(useInteractionStore.getState().nearbyId, target.id);
  runtime.position = { x: 0, y: 1.05, z: 2.2 }; runtime.interactionRequested = true;
  updateBuildingInteractions(runtime, unobstructed, 1100);
  assert.equal(useInteractionStore.getState().buildingId, null);
  assert.equal(useInteractionStore.getState().nearbyId, null);
  runtime.position = approach(target); runtime.interactionRequested = true;
  useGameStore.getState().setPanel("settings");
  updateBuildingInteractions(runtime, unobstructed, 1200);
  assert.equal(useInteractionStore.getState().buildingId, null);
  assert.equal(runtime.interactionRequested, false);
  useGameStore.getState().setPanel(null); runtime.input.focused = false; runtime.interactionRequested = true;
  updateBuildingInteractions(runtime, unobstructed, 1300);
  assert.equal(useInteractionStore.getState().buildingId, null);
});

test("each destination opens, pauses, closes, and resumes without changing position; cooldown blocks spam", () => {
  const runtime = createPlayerRuntime();
  useGameStore.getState().startGame();
  let now = 2000;
  for (const target of buildingInteractables) {
    runtime.position = approach(target); const position = { ...runtime.position };
    runtime.interactionRequested = true; updateBuildingInteractions(runtime, unobstructed, now);
    assert.equal(useInteractionStore.getState().buildingId, target.id);
    assert.equal(useGameStore.getState().activePanel, "building");
    assert.equal(useGameStore.getState().gamePaused, true);
    runtime.interactionRequested = true; updateBuildingInteractions(runtime, unobstructed, now + 1);
    assert.equal(useInteractionStore.getState().buildingId, target.id);
    useInteractionStore.getState().beginClose();
    runtime.interactionRequested = true; updateBuildingInteractions(runtime, unobstructed, now + 20);
    assert.equal(useInteractionStore.getState().phase, "closing");
    useInteractionStore.getState().finishClose(now + 180);
    assert.equal(useGameStore.getState().gamePaused, false);
    assert.equal(useInteractionStore.getState().buildingId, null);
    assert.deepEqual(runtime.position, position);
    runtime.interactionRequested = true; updateBuildingInteractions(runtime, unobstructed, now + 200);
    assert.equal(useInteractionStore.getState().buildingId, null);
    now += 1000;
  }
});

test("stationary frames publish no redundant UI updates; teardown preserves an explicit pause", () => {
  const runtime = createPlayerRuntime(); runtime.position = approach(buildingInteractables[0]);
  useGameStore.getState().startGame();
  updateBuildingInteractions(runtime, unobstructed, 1000);
  let writes = 0;
  const unsubscribe = useInteractionStore.subscribe(() => { writes++; });
  for (let i = 0; i < 120; i++) updateBuildingInteractions(runtime, unobstructed, 1000 + i);
  unsubscribe(); assert.equal(writes, 0);
  runtime.interactionRequested = true; updateBuildingInteractions(runtime, unobstructed, 2000);
  useGameStore.getState().setPaused(true);
  useInteractionStore.getState().beginClose(); useInteractionStore.getState().finishClose(2200);
  assert.equal(useGameStore.getState().gamePaused, true);
  useInteractionStore.getState().reset();
  assert.equal(useInteractionStore.getState().nearbyId, null);
  assert.equal(useInteractionStore.getState().buildingId, null);
});
