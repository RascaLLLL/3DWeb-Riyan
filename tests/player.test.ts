import assert from "node:assert/strict";
import test, { before } from "node:test";
import RAPIER from "@dimforge/rapier3d-compat";
import { Quaternion, Euler } from "three";
import { playerConfig as config } from "../src/data/player";
import { localToWorld, worldConfig } from "../src/data/world";
import { createVillageModel } from "../src/systems/world/village-model";
import { createTerrainData } from "../src/systems/world/terrain-data";
import { createRoofColliders, createSurfaceObstacles } from "../src/systems/world/collision-data";
import { cameraRelativeDirection, createPlayerRuntime, recordPlayerPosition, shortestAngle, updatePlayerMotion } from "../src/systems/player/motion";
import { configureCharacterController, createControllerScratch, stepCharacter } from "../src/systems/player/controller";
import { cameraSafeDistance } from "../src/systems/player/camera";
import { useGameStore } from "../src/stores/game-store";
import { bindPlayerInput } from "../src/systems/player/input";
import type { StaticObstacle } from "../src/types/world";

before(async () => { await RAPIER.init(); });
const terrain = createTerrainData(), model = createVillageModel();

function harness(village = false, selected: StaticObstacle[] = []) {
  const world = new RAPIER.World({ x: 0, y: -config.gravity, z: 0 });
  world.timestep = config.fixedStep;
  const fixed = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const quaternion = new Quaternion();
  const box = (obstacle: StaticObstacle) => {
    quaternion.setFromEuler(new Euler(0, obstacle.rotation, 0));
    world.createCollider(RAPIER.ColliderDesc.cuboid(...obstacle.halfExtents)
      .setTranslation(...obstacle.center).setRotation(quaternion).setFriction(0), fixed);
  };
  if (village) {
    world.createCollider(RAPIER.ColliderDesc.trimesh(terrain.positions, terrain.indices), fixed);
    world.createCollider(RAPIER.ColliderDesc.cylinder(.075, worldConfig.square.radius).setTranslation(0, .075, 0), fixed);
    [...model.obstacles, ...createSurfaceObstacles()].forEach(box);
    createRoofColliders(model.parts).forEach((roof) => {
      quaternion.setFromEuler(new Euler(...roof.rotation));
      const description = RAPIER.ColliderDesc.convexHull(roof.vertices);
      assert.ok(description);
      world.createCollider(description.setTranslation(...roof.position).setRotation(quaternion), fixed);
    });
  } else {
    world.createCollider(RAPIER.ColliderDesc.cuboid(50, .1, 50).setTranslation(0, -.1, 0), fixed);
    selected.forEach(box);
  }
  const runtime = createPlayerRuntime();
  runtime.input.focused = true;
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(runtime.position.x, runtime.position.y, runtime.position.z));
  const collider = world.createCollider(RAPIER.ColliderDesc.capsule(config.capsuleHalfHeight, config.radius), body);
  const controller = configureCharacterController(world), scratch = createControllerScratch();
  world.step();
  return {
    world, body, collider, runtime,
    tick(count: number, blocked = false) {
      for (let i = 0; i < count; i++) {
        stepCharacter(runtime, body, collider, controller, config.fixedStep, blocked, scratch);
        world.step(); recordPlayerPosition(runtime, body.translation());
      }
    },
    teleport(position: [number, number, number]) {
      body.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
      body.setNextKinematicTranslation({ x: position[0], y: position[1], z: position[2] });
      runtime.verticalVelocity = 0; runtime.grounded = false;
      runtime.velocity.x = 0; runtime.velocity.z = 0;
      world.step(); recordPlayerPosition(runtime, body.translation());
    },
    free() { world.free(); },
  };
}

test("camera-relative input normalizes diagonals and rotates forward", () => {
  const out = { x: 0, z: 0 };
  cameraRelativeDirection(1, 1, 0, out);
  assert.ok(Math.abs(Math.hypot(out.x, out.z) - 1) < 1e-10);
  cameraRelativeDirection(0, 1, Math.PI / 2, out);
  assert.ok(Math.abs(out.x + 1) < 1e-10 && Math.abs(out.z) < 1e-10);
  assert.ok(Math.abs(shortestAngle(Math.PI - .1, -Math.PI + .1) - .2) < 1e-10);
});

test("acceleration, deceleration, turning, running, and interaction states", () => {
  const state = createPlayerRuntime(), direction = { x: 0, z: 0 };
  state.input.keys.add("KeyD");
  updatePlayerMotion(state, config.fixedStep, false, direction);
  assert.ok(state.speed > 0 && state.speed < config.walkSpeed);
  assert.equal(state.animation, "turning");
  for (let i = 0; i < 120; i++) updatePlayerMotion(state, config.fixedStep, false, direction);
  assert.ok(Math.abs(state.heading - Math.PI / 2) < .01);
  assert.equal(state.state, "walking");
  state.input.keys.add("ShiftLeft");
  for (let i = 0; i < 60; i++) updatePlayerMotion(state, config.fixedStep, false, direction);
  assert.equal(state.state, "running");
  assert.ok(state.speed > config.walkSpeed + 1);
  state.waveRequested = true;
  updatePlayerMotion(state, config.fixedStep, false, direction);
  assert.equal(state.state, "interacting");
  state.input.keys.clear();
  for (let i = 0; i < 180; i++) updatePlayerMotion(state, config.fixedStep, false, direction);
  assert.equal(state.state, "idle"); assert.equal(state.speed, 0);
});

test("real Rapier ground support remains stable in the village for ten seconds", () => {
  const h = harness(true);
  try {
    h.tick(600);
    assert.ok(h.runtime.grounded);
    assert.ok(h.runtime.position.y > 1.06 && h.runtime.position.y < 1.15, `Ground height: ${h.runtime.position.y}`);
    const height = h.runtime.position.y;
    h.tick(300);
    assert.ok(Math.abs(h.runtime.position.y - height) < .003);
  } finally { h.free(); }
});

test("real Rapier movement has equal diagonal speed and running is faster", () => {
  const distance = (diagonal: boolean, running: boolean) => {
    const h = harness();
    try {
      h.tick(30); const start = { ...h.runtime.position };
      h.runtime.input.keys.add("KeyW"); if (diagonal) h.runtime.input.keys.add("KeyD"); if (running) h.runtime.input.keys.add("ShiftLeft");
      h.tick(120);
      return Math.hypot(h.runtime.position.x - start.x, h.runtime.position.z - start.z);
    } finally { h.free(); }
  };
  const straight = distance(false, false), diagonal = distance(true, false), run = distance(false, true);
  assert.ok(Math.abs(straight - diagonal) < .02);
  assert.ok(run > straight * 1.65);
});

test("the four house bodies block a running capsule at their entrances", () => {
  const h = harness(true);
  try {
    for (const building of worldConfig.buildings.filter((b) => b.id !== "gate")) {
      const start = localToWorld([0, 1.2, building.size[2] / 2 + 4], building.position, building.rotation);
      h.teleport(start); h.runtime.input.keys.clear(); h.runtime.input.keys.add("KeyW"); h.runtime.input.keys.add("ShiftLeft");
      h.runtime.cameraYaw = building.rotation;
      h.tick(180);
      const dx = h.runtime.position.x - building.position[0], dz = h.runtime.position.z - building.position[2];
      const localZ = dx * Math.sin(building.rotation) + dz * Math.cos(building.rotation);
      assert.ok(localZ >= building.size[2] / 2 + config.radius - .08, `${building.id} penetrated: ${localZ}`);
      assert.ok(localZ < building.size[2] / 2 + 3.5, `${building.id} approach did not move`);
      assert.ok(h.runtime.grounded);
    }
  } finally { h.free(); }
});

test("a large tree trunk blocks the capsule", () => {
  const trunk = model.obstacles.find((o) => o.kind === "nature" && o.halfExtents[1] > 1 && Math.abs(o.center[1] - o.halfExtents[1]) < .05);
  assert.ok(trunk);
  const h = harness(false, [trunk]);
  try {
    h.teleport(localToWorld([0, 1.1 - trunk.center[1], 4], trunk.center, trunk.rotation));
    h.runtime.cameraYaw = trunk.rotation;
    h.runtime.input.keys.add("KeyW"); h.runtime.input.keys.add("ShiftLeft"); h.tick(120);
    const dx = h.runtime.position.x - trunk.center[0], dz = h.runtime.position.z - trunk.center[2];
    const localZ = dx * Math.sin(trunk.rotation) + dz * Math.cos(trunk.rotation);
    assert.ok(localZ > trunk.halfExtents[2] + config.radius - .05, `Tree penetration: ${localZ}`);
    assert.ok(h.runtime.blocked);
  } finally { h.free(); }
});

test("the gate passage is traversable and the finite perimeter stops escape", () => {
  const h = harness(true);
  try {
    h.teleport([0, 1.2, 21]); h.runtime.cameraYaw = Math.PI;
    h.runtime.input.keys.add("KeyW"); h.runtime.input.keys.add("ShiftLeft"); h.tick(240);
    assert.ok(h.runtime.position.z > 28, `Gate blocked: ${h.runtime.position.z}`);
    assert.ok(h.runtime.position.z < 35.6, `Boundary escaped: ${h.runtime.position.z}`);
    assert.ok(h.runtime.position.y > 0);
  } finally { h.free(); }
});

test("pause and focus loss stop movement and clear held keys", () => {
  const h = harness();
  try {
    h.runtime.input.keys.add("KeyW"); h.tick(45);
    const before = { ...h.runtime.position }; h.tick(120, true);
    assert.ok(Math.hypot(h.runtime.position.x - before.x, h.runtime.position.z - before.z) < .001);
    assert.equal(h.runtime.state, "paused"); assert.equal(h.runtime.input.keys.size, 0);
    h.runtime.input.keys.add("KeyW"); h.runtime.input.focused = false; h.tick(60);
    assert.equal(h.runtime.speed, 0); assert.equal(h.runtime.input.keys.size, 0);
  } finally { h.free(); }
});

test("settings preserve a manual pause and runtime flags are excluded from persistence", () => {
  useGameStore.getState().startGame(); useGameStore.getState().setPaused(true);
  useGameStore.getState().setPanel("settings"); useGameStore.getState().setPanel(null);
  assert.equal(useGameStore.getState().gamePaused, true);
  useGameStore.getState().setPaused(false); assert.equal(useGameStore.getState().gamePaused, false);
  const saved = useGameStore.persist.getOptions().partialize!(useGameStore.getState());
  assert.ok(saved && typeof saved === "object");
  assert.ok(!("userPaused" in saved) && !("gamePaused" in saved));
  useGameStore.getState().stopGame();
});

test("camera sphere sweep stops before a building and excludes the resident", () => {
  const h = harness(false, [{ id: "camera-wall", kind: "building", center: [0, 2, 5], halfExtents: [2, 2, .5], rotation: 0 }]);
  try {
    const sphere = new RAPIER.Ball(config.camera.collisionRadius);
    const distance = cameraSafeDistance(h.world, sphere, { x: 0, y: 1.5, z: 0 }, { x: 0, y: 0, z: 1 }, 8, h.body);
    assert.ok(distance > 3 && distance < 4.5);
    assert.equal(cameraSafeDistance(h.world, sphere, { x: 0, y: 1.5, z: 0 }, { x: 0, y: 0, z: -1 }, 8, h.body), 8);
  } finally { h.free(); }
});

test("input bindings clear on blur, ignore forms/menus, release capture, and remove listeners", () => {
  class Surface extends EventTarget {
    captured = new Set<number>();
    editable = false;
    closest() { return this.editable ? this : null; }
    setAttribute() { /* DOM attribute configuration is not needed by this harness. */ }
    focus() { documentState.activeElement = this; }
    setPointerCapture(id: number) { this.captured.add(id); }
    hasPointerCapture(id: number) { return this.captured.has(id); }
    releasePointerCapture(id: number) { this.captured.delete(id); }
  }
  const windowSurface = new Surface(), documentSurface = new Surface(), canvas = new Surface();
  const documentState = { activeElement: canvas as Surface, hidden: false, hasFocus: () => true };
  Object.assign(documentSurface, documentState);
  // focus()/keydown use the same active element property.
  Object.defineProperty(documentSurface, "activeElement", { get: () => documentState.activeElement });
  const originals = ["window", "document", "HTMLElement"].map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const);
  Object.defineProperty(globalThis, "window", { configurable: true, value: windowSurface });
  Object.defineProperty(globalThis, "document", { configurable: true, value: documentSurface });
  Object.defineProperty(globalThis, "HTMLElement", { configurable: true, value: Surface });
  const send = (surface: Surface, type: string, values: object = {}) => surface.dispatchEvent(Object.assign(new Event(type, { cancelable: true }), values));
  const state = createPlayerRuntime();
  useGameStore.getState().startGame();
  const cleanup = bindPlayerInput(canvas as unknown as HTMLCanvasElement, { current: state });
  try {
    send(windowSurface, "keydown", { code: "KeyW" }); assert.ok(state.input.keys.has("KeyW"));
    const editor = new Surface(); editor.editable = true; documentState.activeElement = editor;
    send(windowSurface, "keydown", { code: "KeyE" }); assert.equal(state.waveRequested, false);
    documentState.activeElement = canvas;
    useGameStore.getState().setPanel("settings"); assert.equal(state.input.keys.size, 0);
    send(windowSurface, "keydown", { code: "KeyW" }); assert.equal(state.input.keys.size, 0);
    useGameStore.getState().setPanel(null);
    send(canvas, "pointerdown", { button: 0, isPrimary: true, pointerId: 1, clientX: 10, clientY: 10 });
    assert.ok(canvas.hasPointerCapture(1));
    send(canvas, "pointermove", { pointerId: 1, clientX: 110, clientY: 10000 });
    assert.ok(state.cameraYaw < 0); assert.equal(state.cameraPitch, config.camera.maxPitch);
    send(windowSurface, "blur");
    assert.equal(state.input.focused, false); assert.equal(canvas.captured.size, 0);
    assert.equal(state.input.keys.size, 0);
    cleanup();
    state.input.focused = true;
    send(windowSurface, "keydown", { code: "KeyW" }); assert.equal(state.input.keys.size, 0);
    send(canvas, "pointerdown", { button: 0, isPrimary: true, pointerId: 2, clientX: 0, clientY: 0 });
    assert.equal(canvas.captured.size, 0);
  } finally {
    cleanup(); useGameStore.getState().stopGame();
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor); else Reflect.deleteProperty(globalThis, name);
    }
  }
});
