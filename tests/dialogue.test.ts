import assert from "node:assert/strict";
import test, { before, afterEach } from "node:test";
import RAPIER from "@dimforge/rapier3d-compat";
import { Euler, Quaternion } from "three";
import { npcs } from "../src/data/npcs";
import { dialogues } from "../src/data/dialogues";
import { discoveryObjectives } from "../src/data/discoveries";
import { worldConfig } from "../src/data/world";
import { playerConfig } from "../src/data/player";
import { portfolio } from "../src/data/portfolio";
import { startDialogue, advanceDialogue } from "../src/systems/dialogue/engine";
import { validateDialogueCatalog } from "../src/systems/dialogue/validate";
import { nearestNpc } from "../src/systems/interactions/npc-selection";
import { createNpcVisibilityQuery } from "../src/systems/interactions/visibility";
import { updateWorldInteractions } from "../src/systems/interactions/manager";
import { createPlayerRuntime, shortestAngle } from "../src/systems/player/motion";
import { cameraSafeDistance, conversationCameraYaw } from "../src/systems/player/camera";
import { createVillageModel } from "../src/systems/world/village-model";
import { useGameStore } from "../src/stores/game-store";
import { useInteractionStore } from "../src/stores/interaction-store";
import { useDialogueStore } from "../src/stores/dialogue-store";
import { useGuidanceStore } from "../src/stores/guidance-store";
import { questStore } from "../src/stores/quest-store";
import { initialExplorationProgress } from "../src/systems/exploration/progress";
import type { DialogueCatalog, DialogueSession } from "../src/types/dialogue";
import type { NpcDefinition } from "../src/types/npc";

before(async () => { await RAPIER.init(); });
afterEach(() => {
  useDialogueStore.getState().reset(); useInteractionStore.getState().reset();
  useGuidanceStore.getState().reset(); useGameStore.getState().stopGame();
  questStore.setState(initialExplorationProgress());
});
const visible = () => true;
function approachNpc(npc: NpcDefinition) {
  const length = Math.hypot(npc.position[0], npc.position[2]);
  return { x: npc.position[0] - npc.position[0] / length * 1.3, y: npc.position[1] + playerConfig.centerHeight + .025,
    z: npc.position[2] - npc.position[2] / length * 1.3 };
}
function begin(npc: NpcDefinition, now = 1000) {
  useGameStore.getState().startGame();
  const runtime = createPlayerRuntime(); runtime.position = approachNpc(npc); runtime.input.focused = true;
  runtime.interactionRequested = true;
  updateWorldInteractions(runtime, () => false, visible, now);
  assert.equal(useDialogueStore.getState().session?.npcId, npc.id);
  return runtime;
}

test("five distinct villagers have finite placements, appearances, animations, and valid trees", () => {
  assert.equal(npcs.length, 5);
  assert.equal(new Set(npcs.map((npc) => npc.id)).size, 5);
  assert.equal(new Set(npcs.map((npc) => npc.appearance.reference)).size, 5);
  for (const npc of npcs) {
    assert.ok(npc.position.every(Number.isFinite) && Number.isFinite(npc.rotation));
    assert.ok(npc.interactionRange > 0 && npc.interactionRange <= 3);
    assert.ok(npc.animations.turnSpeed > 0 && npc.animations.idle.breathing > 0);
    assert.equal(dialogues[npc.dialogueTreeId].npcId, npc.id);
    if (npc.associatedDestination !== "square") {
      const anchor = worldConfig.buildings.find((b) => b.id === npc.associatedDestination)!.interactionAnchor.position;
      assert.ok(Math.hypot(npc.position[0] - anchor[0], npc.position[2] - anchor[2]) < 4);
    } else assert.ok(Math.hypot(npc.position[0], npc.position[2]) < worldConfig.square.radius);
  }
  assert.deepEqual(validateDialogueCatalog(dialogues, worldConfig.buildings.map((b) => b.id), Object.keys(discoveryObjectives)), []);
});

test("every published node and choice is traversable without missing references", () => {
  for (const tree of Object.values(dialogues)) {
    const pending: DialogueSession[] = [startDialogue(dialogues, tree.npcId, tree.id).session!], visited = new Set<string>();
    while (pending.length) {
      const session = pending.pop()!, key = `${session.treeId}:${session.nodeId}`;
      if (visited.has(key)) continue;
      visited.add(key);
      const node = dialogues[session.treeId].nodes[session.nodeId];
      const inputs = node.choices?.map((choice) => ({ type: "choice" as const, id: choice.id })) ?? [{ type: "continue" as const }];
      for (const input of inputs) {
        const result = advanceDialogue(dialogues, session, input);
        assert.equal(result.error, undefined, key);
        if (result.session) pending.push(result.session);
      }
    }
    assert.equal(visited.size, Object.keys(tree.nodes).length, `${tree.id}: unreachable authored node`);
  }
});

test("branches, Continue, close, guidance, objectives, and portfolio actions produce real transitions", () => {
  const start = startDialogue(dialogues, "alden", "village-guide");
  assert.deepEqual(start.effects, [{ type: "complete-objective", objective: "meet-guide" }]);
  const controls = advanceDialogue(dialogues, start.session!, { type: "choice", id: "controls" });
  assert.equal(controls.session?.nodeId, "controls");
  const camera = advanceDialogue(dialogues, controls.session!, { type: "continue" });
  assert.equal(camera.session?.nodeId, "camera");
  assert.equal(advanceDialogue(dialogues, camera.session!, { type: "choice", id: "leave" }).session, null);
  const menu = advanceDialogue(dialogues, start.session!, { type: "choice", id: "directions" });
  const direction = advanceDialogue(dialogues, menu.session!, { type: "choice", id: "library" });
  assert.equal(direction.session?.nodeId, "way-library");
  assert.deepEqual(direction.effects, [{ type: "highlight-destination", destination: "library" }]);
  for (const npc of npcs.filter((entry) => entry.id !== "alden")) {
    const session = startDialogue(dialogues, npc.id, npc.dialogueTreeId).session!;
    const result = advanceDialogue(dialogues, session, { type: "choice", id: "open" });
    assert.equal(result.session, null);
    assert.deepEqual(result.effects, [{ type: "open-panel", destination: npc.associatedDestination }]);
  }
});

test("invalid choices do not bypass a menu; broken nodes and automatic cycles fail safely", () => {
  const session = startDialogue(dialogues, "alden", "village-guide").session!;
  assert.equal(advanceDialogue(dialogues, session, { type: "choice", id: "missing" }).session, session);
  assert.equal(advanceDialogue(dialogues, session, { type: "continue" }).session, session);
  const broken = structuredClone(dialogues) as DialogueCatalog;
  broken["village-guide"].nodes.controls.next = "not-a-node";
  const controls = advanceDialogue(broken, session, { type: "choice", id: "controls" }).session!;
  assert.ok(advanceDialogue(broken, controls, { type: "continue" }).error);
  assert.ok(validateDialogueCatalog(broken, worldConfig.buildings.map((b) => b.id), Object.keys(discoveryObjectives)).some((error) => error.includes("missing node")));
  const loop = structuredClone(dialogues) as DialogueCatalog;
  loop["village-guide"].nodes.welcome.action = { type: "branch", treeId: "village-guide", nodeId: "controls" };
  loop["village-guide"].nodes.controls.action = { type: "branch", treeId: "village-guide", nodeId: "welcome" };
  const result = startDialogue(loop, "alden", "village-guide");
  assert.equal(result.session, null); assert.ok(result.error);
  assert.ok(validateDialogueCatalog(loop, worldConfig.buildings.map((b) => b.id), Object.keys(discoveryObjectives)).some((error) => error.includes("automatic branch cycle")));
});

test("real village obstacles leave NPC placements and approaches clear; rays exclude only the addressed NPC", () => {
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  try {
    const quaternion = new Quaternion(), fixed = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    for (const obstacle of createVillageModel().obstacles) {
      quaternion.setFromEuler(new Euler(0, obstacle.rotation, 0));
      world.createCollider(RAPIER.ColliderDesc.cuboid(...obstacle.halfExtents).setTranslation(...obstacle.center).setRotation(quaternion), fixed);
    }
    world.step();
    for (const npc of npcs) {
      const shape = new RAPIER.Capsule(.6, .28);
      assert.equal(world.intersectionWithShape({ x: npc.position[0], y: npc.position[1] + .88, z: npc.position[2] }, { x: 0, y: 0, z: 0, w: 1 }, shape), null, `${npc.id} overlaps village obstacle`);
    }
    for (const npc of npcs) {
      const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(...npc.position));
      body.userData = { kind: "npc", id: npc.id };
      world.createCollider(RAPIER.ColliderDesc.capsule(.6, .28).setTranslation(0, .88, 0), body);
    }
    world.step();
    const query = createNpcVisibilityQuery(world, new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }));
    for (const npc of npcs) assert.equal(query(approachNpc(npc), npc), true, `${npc.id} talk ray obstructed`);
    const npc = npcs[0], position = approachNpc(npc);
    const wall = world.createCollider(RAPIER.ColliderDesc.cuboid(.2, 2, .2).setTranslation((npc.position[0] + position.x) / 2, 1, (npc.position[2] + position.z) / 2));
    world.step(); assert.equal(query(position, npc), false);
    wall.setSensor(true); world.step(); assert.equal(query(position, npc), true);
    const stranger = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation((npc.position[0] + position.x) / 2, 0, (npc.position[2] + position.z) / 2));
    stranger.userData = { kind: "npc", id: "rowan" };
    world.createCollider(RAPIER.ColliderDesc.capsule(.6, .28).setTranslation(0, .88, 0), stranger); world.step();
    assert.equal(query(position, npc), false, "another NPC is a real obstacle");
  } finally { world.free(); }
});

test("NPC range, floor, visibility, and nearest building/NPC arbitration share one E request", () => {
  const npc = npcs[0], runtime = createPlayerRuntime();
  assert.equal(nearestNpc(approachNpc(npc), npcs, visible)?.id, npc.id);
  const high = approachNpc(npc); high.y += 5;
  assert.equal(nearestNpc(high, npcs, visible), null);
  assert.equal(nearestNpc(approachNpc(npc), npcs, () => false), null);
  useGameStore.getState().startGame();
  runtime.position = approachNpc(npc); updateWorldInteractions(runtime, visible, visible, 1000);
  assert.equal(useInteractionStore.getState().nearbyNpcId, "alden");
  const guild = worldConfig.buildings.find((b) => b.id === "guild")!, anchor = guild.interactionAnchor.position;
  runtime.position = { x: anchor[0], y: 1.05, z: anchor[2] };
  updateWorldInteractions(runtime, visible, visible, 1100);
  assert.equal(useInteractionStore.getState().nearbyId, "guild");
  assert.equal(useInteractionStore.getState().nearbyNpcId, null);
  runtime.position = { x: 30, y: 1, z: 0 }; runtime.interactionRequested = true;
  updateWorldInteractions(runtime, visible, visible, 1200);
  assert.equal(useDialogueStore.getState().session, null);
  assert.equal(useGameStore.getState().activePanel, null);
});

test("all villagers can talk/close with position preserved; held requests and cooldown cannot reopen", () => {
  let now = 1000;
  for (const npc of npcs) {
    useInteractionStore.getState().reset();
    const runtime = begin(npc, now), position = { ...runtime.position };
    assert.equal(useGameStore.getState().gamePaused, true);
    runtime.interactionRequested = true; updateWorldInteractions(runtime, visible, visible, now + 1);
    assert.equal(useDialogueStore.getState().session?.npcId, npc.id);
    useDialogueStore.getState().beginClose(); useDialogueStore.getState().beginClose();
    useDialogueStore.getState().finishClose(now + 180);
    assert.equal(useDialogueStore.getState().session, null);
    assert.equal(useGameStore.getState().gamePaused, false);
    assert.deepEqual(runtime.position, position);
    runtime.interactionRequested = true; updateWorldInteractions(runtime, visible, visible, now + 190);
    assert.equal(useDialogueStore.getState().session, null);
    now += 1000;
  }
});

test("dialogue hands off to each correct portfolio panel without an unpaused state", () => {
  for (const npc of npcs.filter((entry) => entry.id !== "alden")) {
    useDialogueStore.getState().reset(); useInteractionStore.getState().reset();
    const runtime = begin(npc), position = { ...runtime.position };
    const transitions: boolean[] = [], unsubscribe = useGameStore.subscribe((game) => transitions.push(game.gamePaused));
    useDialogueStore.getState().respond({ type: "choice", id: "open" });
    unsubscribe();
    assert.ok(transitions.every(Boolean));
    assert.equal(useDialogueStore.getState().session, null);
    assert.equal(useGameStore.getState().activePanel, "building");
    assert.equal(useInteractionStore.getState().buildingId, npc.associatedDestination);
    assert.deepEqual(runtime.position, position);
    useInteractionStore.getState().beginClose(); useInteractionStore.getState().finishClose(2000);
    assert.equal(useGameStore.getState().gamePaused, false);
  }
});

test("directions and discovery actions update guidance and the journal without moving the resident", () => {
  const runtime = begin(npcs[0]), position = { ...runtime.position };
  assert.deepEqual(questStore.getState().completedObjectives, ["meet-guide"]);
  useDialogueStore.getState().respond({ type: "choice", id: "directions" });
  useDialogueStore.getState().respond({ type: "choice", id: "library" });
  assert.equal(useGuidanceStore.getState().destination, "library");
  assert.deepEqual(runtime.position, position);
  useDialogueStore.getState().respond({ type: "continue" });
  useDialogueStore.getState().respond({ type: "choice", id: "back" });
  assert.deepEqual(questStore.getState().completedObjectives, ["meet-guide"], "idempotent objective action");
  useGameStore.getState().setPaused(true);
  useDialogueStore.getState().beginClose(); useDialogueStore.getState().finishClose(2000);
  assert.equal(useGameStore.getState().gamePaused, true);
});

test("NPC interaction respects settings/focus guards and public contact data retains an unavailable CV", () => {
  useGameStore.getState().startGame();
  const runtime = createPlayerRuntime(); runtime.position = approachNpc(npcs[0]);
  useGameStore.getState().setPanel("settings");
  runtime.interactionRequested = true; updateWorldInteractions(runtime, visible, visible, 1000);
  assert.equal(useDialogueStore.getState().session, null);
  useGameStore.getState().setPanel(null); runtime.input.focused = false;
  runtime.interactionRequested = true; updateWorldInteractions(runtime, visible, visible, 1100);
  assert.equal(useDialogueStore.getState().session, null);
  assert.equal(portfolio.contact.cv, null); assert.equal(portfolio.contact.socialProfiles.length, 3);
  const saved = useGameStore.persist.getOptions().partialize!(useGameStore.getState())!;
  assert.ok(saved && typeof saved === "object");
  assert.ok(!("session" in saved) && !("completedObjectives" in saved));
});

test("conversation framing uses the nearest side of the pair with no turn beyond 90 degrees", () => {
  const position = { x: 1, z: -2 };
  for (const npc of npcs) for (let yaw = -Math.PI * 2; yaw < Math.PI * 2; yaw += .17) {
    const framed = conversationCameraYaw(yaw, position, npc.position);
    assert.ok(Math.abs(shortestAngle(yaw, framed)) <= Math.PI / 2 + 1e-10);
    const dot = Math.sin(framed) * (npc.position[0] - position.x) + Math.cos(framed) * (npc.position[2] - position.z);
    assert.ok(Math.abs(dot) < 1e-10, "camera views the two residents from the side");
  }
});

test("an unavailable portfolio handoff leaves a closeable conversation instead of a stuck pause", () => {
  begin(npcs.find((npc) => npc.id === "elara")!);
  useInteractionStore.setState({ phase: "open" }); // Fault injection: a conflicting panel owner.
  useDialogueStore.getState().respond({ type: "choice", id: "open" });
  assert.equal(useDialogueStore.getState().phase, "closing");
  assert.ok(useDialogueStore.getState().session);
  assert.ok(useDialogueStore.getState().error);
  useDialogueStore.getState().finishClose(2000);
  assert.equal(useGameStore.getState().gamePaused, false);
  assert.equal(useDialogueStore.getState().session, null);
});

test("close conversation framing excludes its focus NPC while still stopping before a wall", () => {
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  try {
    const npc = world.createRigidBody(RAPIER.RigidBodyDesc.fixed()); npc.userData = { kind: "npc", id: "alden" };
    world.createCollider(RAPIER.ColliderDesc.capsule(.6, .28).setTranslation(0, 1, .3), npc);
    world.createCollider(RAPIER.ColliderDesc.cuboid(2, 2, .2).setTranslation(0, 2, 4)); world.step();
    const sphere = new RAPIER.Ball(.18), origin = { x: 0, y: 1.35, z: 0 }, direction = { x: 0, y: 0, z: 1 };
    assert.ok(cameraSafeDistance(world, sphere, origin, direction, 6) < .2);
    const safe = cameraSafeDistance(world, sphere, origin, direction, 6, undefined, (collider) => collider.parent()?.handle !== npc.handle);
    assert.ok(safe > 3 && safe < 3.8, `wall must still block camera: ${safe}`);
  } finally { world.free(); }
});
