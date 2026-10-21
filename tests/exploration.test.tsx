import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { StateStorage } from "zustand/middleware";
import { quests, questsById, explorationCompletionMessage } from "../src/data/quests";
import { npcsById } from "../src/data/npcs";
import { localToWorld, worldConfig } from "../src/data/world";
import { playerConfig } from "../src/data/player";
import { initialExplorationProgress, questRecords, readExplorationProgress } from "../src/systems/exploration/progress";
import { mapRotation, mapScale, questPosition, worldToMap } from "../src/systems/exploration/map";
import { openExplorationPanel, closeExplorationPanel } from "../src/systems/exploration/panels";
import { createQuestStore, questStore, hydrateQuestProgress, explorationStorageKey } from "../src/stores/quest-store";
import { useGameStore } from "../src/stores/game-store";
import { useDialogueStore } from "../src/stores/dialogue-store";
import { useInteractionStore } from "../src/stores/interaction-store";
import { useGuidanceStore } from "../src/stores/guidance-store";
import { updateWorldInteractions } from "../src/systems/interactions/manager";
import { createPlayerRuntime } from "../src/systems/player/motion";
import { QuestJournal } from "../src/components/world/exploration/quest-journal";
import { VillageOverviewMap } from "../src/components/world/exploration/village-overview-map";
import type { NpcId } from "../src/types/npc";
import type { QuestId } from "../src/types/quest";

function memoryStorage() {
  const values = new Map<string, string>();
  const storage: StateStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } };
  return { values, storage };
}
afterEach(() => {
  useDialogueStore.getState().reset(); useInteractionStore.getState().reset();
  useGuidanceStore.getState().reset(); useGameStore.getState().stopGame();
  questStore.setState(initialExplorationProgress());
});
function talk(id: NpcId, now = 1000) {
  const npc = npcsById[id], runtime = createPlayerRuntime();
  runtime.position = { x: npc.position[0] + .9, y: npc.position[1] + playerConfig.centerHeight, z: npc.position[2] + .3 };
  runtime.input.focused = true; runtime.interactionRequested = true;
  updateWorldInteractions(runtime, () => false, () => true, now);
  assert.equal(useDialogueStore.getState().session?.npcId, id);
  return runtime;
}
function endTalk(now = 1200) { useDialogueStore.getState().beginClose(); useDialogueStore.getState().finishClose(now); }

test("five optional quests have real targets, locations, and three derived statuses", () => {
  assert.equal(quests.length, 5); assert.equal(new Set(quests.map((q) => q.id)).size, 5);
  for (const quest of quests) {
    assert.ok(quest.instruction && quest.discovery);
    assert.ok(questPosition(quest).every(Number.isFinite));
    if (quest.objectiveType === "talk-to-npc") assert.equal(npcsById[quest.targetId].associatedDestination, quest.location);
    else assert.ok(worldConfig.buildings.some((b) => b.id === quest.targetId));
  }
  const state = createQuestStore(memoryStorage().storage);
  assert.deepEqual(questRecords(state.getState()).map((q) => q.status), ["active", "not-started", "not-started", "not-started", "not-started"]);
  state.getState().selectObjective("pages-of-past");
  assert.equal(questRecords(state.getState()).find((q) => q.id === "pages-of-past")?.status, "active");
  assert.deepEqual(state.getState().completedObjectives, []);
});

test("all five complete through actual interaction paths, out of order and without tracking", () => {
  useGameStore.getState().startGame(); questStore.getState().selectObjective(null);
  let now = 1000;
  for (const id of ["rowan", "borin", "lyra", "alden"] as NpcId[]) {
    talk(id, now); endTalk(now + 180); now += 1000;
  }
  assert.equal(questStore.getState().completedObjectives.length, 4);
  const guild = worldConfig.buildings.find((b) => b.id === "guild")!;
  const [x, y, z] = localToWorld([0, playerConfig.centerHeight + .15, guild.size[2] / 2 + 2.4], guild.position, guild.rotation);
  const runtime = createPlayerRuntime(); runtime.position = { x, y, z }; runtime.input.focused = true; runtime.interactionRequested = true;
  updateWorldInteractions(runtime, () => true, () => false, now);
  assert.equal(useInteractionStore.getState().buildingId, "guild");
  assert.equal(questStore.getState().completedObjectives.length, 5);
  useInteractionStore.getState().beginClose(); useInteractionStore.getState().finishClose(now + 180);
  assert.equal(useGameStore.getState().gamePaused, false);
  assert.ok(questRecords(questStore.getState()).every((q) => q.status === "completed"));
});

test("Elara conversation alone does not complete Guild; the project-panel handoff does", () => {
  useGameStore.getState().startGame();
  const runtime = talk("elara"), position = { ...runtime.position };
  assert.deepEqual(questStore.getState().completedObjectives, []);
  useDialogueStore.getState().respond({ type: "choice", id: "open" });
  assert.equal(useInteractionStore.getState().buildingId, "guild");
  assert.deepEqual(questStore.getState().completedObjectives, ["guild-records"]);
  assert.deepEqual(runtime.position, position);
});

test("proximity, elapsed time, blocked requests, map choices, and unrelated panels give no progress", () => {
  useGameStore.getState().startGame();
  const npc = npcsById.borin, runtime = createPlayerRuntime();
  runtime.position = { x: npc.position[0], y: playerConfig.centerHeight, z: npc.position[2] + 1 };
  runtime.input.focused = true;
  updateWorldInteractions(runtime, () => false, () => true, 1000);
  updateWorldInteractions(runtime, () => false, () => true, 1000000);
  runtime.interactionRequested = true; updateWorldInteractions(runtime, () => false, () => false, 1000001);
  runtime.input.focused = false; runtime.interactionRequested = true;
  updateWorldInteractions(runtime, () => false, () => true, 1000002);
  runtime.input.focused = true; openExplorationPanel("map");
  runtime.interactionRequested = true; updateWorldInteractions(runtime, () => true, () => true, 1000003);
  questStore.getState().selectObjective("pages-of-past"); useGuidanceStore.getState().highlight("guild");
  assert.deepEqual(questStore.getState().completedObjectives, []);
  closeExplorationPanel(1000004);
  useInteractionStore.getState().publish("cottage", "Player Cottage");
  useInteractionStore.getState().open("cottage", 1001000);
  assert.equal(useInteractionStore.getState().buildingId, "cottage");
  assert.deepEqual(questStore.getState().completedObjectives, []);
});

test("completion is idempotent, clears completed tracking, and does not publish repeated updates", () => {
  const state = createQuestStore(memoryStorage().storage);
  state.getState().recordEvent({ type: "npc-talked", targetId: "alden" });
  assert.equal(state.getState().selectedObjective, null);
  let updates = 0; const unsubscribe = state.subscribe(() => { updates++; });
  for (let i = 0; i < 100; i++) state.getState().recordEvent({ type: "npc-talked", targetId: "alden" });
  state.getState().selectObjective("meet-guide"); unsubscribe();
  assert.equal(updates, 0); assert.deepEqual(state.getState().completedObjectives, ["meet-guide"]);
});

test("refresh restores only validated versioned progress and selection", async () => {
  const { storage, values } = memoryStorage(), first = createQuestStore(storage);
  await hydrateQuestProgress(first);
  first.getState().recordEvent({ type: "npc-talked", targetId: "borin" }); first.getState().selectObjective("pages-of-past");
  const saved = JSON.parse(values.get(explorationStorageKey)!);
  assert.equal(saved.version, 1);
  assert.deepEqual(Object.keys(saved.state).sort(), ["completedObjectives", "selectedObjective"]);
  const refreshed = createQuestStore(storage);
  assert.deepEqual(refreshed.getState().completedObjectives, [], "no browser read during construction/SSR");
  await hydrateQuestProgress(refreshed);
  assert.deepEqual(refreshed.getState().completedObjectives, ["tools-of-trade"]);
  assert.equal(refreshed.getState().selectedObjective, "pages-of-past");
  assert.equal(questRecords(refreshed.getState()).filter((q) => q.status === "completed").length, 1);
});

test("corrupt, incompatible, duplicated, and unknown saved data cannot invent progress", async () => {
  const { values, storage } = memoryStorage();
  for (const saved of ["{broken", JSON.stringify({ version: 99, state: { completedObjectives: quests.map((q) => q.id) } })]) {
    values.set(explorationStorageKey, saved);
    const state = createQuestStore(storage); await hydrateQuestProgress(state);
    assert.deepEqual(state.getState().completedObjectives, []);
    state.getState().recordEvent({ type: "npc-talked", targetId: "rowan" });
    assert.deepEqual(state.getState().completedObjectives, ["message-beyond"]);
  }
  assert.deepEqual(readExplorationProgress({ completedObjectives: ["meet-guide", "meet-guide", "fake", 42, "__proto__"], selectedObjective: "meet-guide", percent: 100 }), { completedObjectives: ["meet-guide"], selectedObjective: null });
  assert.deepEqual(readExplorationProgress({ completedObjectives: "all", selectedObjective: "fake" }), initialExplorationProgress());
});

test("blocked storage and exhausted quota leave the in-memory journal usable", async () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, get: () => { throw new Error("Storage denied"); } });
    const state = createQuestStore(); await hydrateQuestProgress(state);
    assert.doesNotThrow(() => state.getState().recordEvent({ type: "npc-talked", targetId: "lyra" }));
    assert.deepEqual(state.getState().completedObjectives, ["pages-of-past"]);
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: () => null, setItem: () => { throw new Error("Quota exhausted"); } } });
    assert.doesNotThrow(() => state.getState().selectObjective("message-beyond"));
    assert.equal(state.getState().selectedObjective, "message-beyond");
  } finally { if (previous) Object.defineProperty(globalThis, "localStorage", previous); else Reflect.deleteProperty(globalThis, "localStorage"); }
});

test("journal/map lifecycle respects other dialogs, cooldown, and an explicit pause", () => {
  openExplorationPanel("map"); assert.equal(useGameStore.getState().activePanel, null);
  useGameStore.getState().startGame(); useGameStore.getState().setPanel("dialogue");
  openExplorationPanel("map"); assert.equal(useGameStore.getState().activePanel, "dialogue");
  useGameStore.getState().setPanel(null); useGameStore.getState().setPaused(true);
  openExplorationPanel("journal"); assert.equal(useGameStore.getState().activePanel, "journal");
  assert.equal(useGameStore.getState().gamePaused, true);
  openExplorationPanel("map"); closeExplorationPanel(2000);
  assert.equal(useGameStore.getState().activePanel, null); assert.equal(useGameStore.getState().gamePaused, true);
  assert.ok(useInteractionStore.getState().cooldownUntil > 2000);
});

test("map positions, rotated footprints, NPC targets, and roads match world coordinates", () => {
  assert.deepEqual(worldToMap(0, 0), [300, 300]);
  assert.ok(worldToMap(0, -10)[1] < 300); assert.ok(worldToMap(10, 0)[0] > 300);
  for (const b of worldConfig.buildings) {
    const [x, y] = worldToMap(b.position[0], b.position[2]);
    const local = [b.size[0] / 2, 0, b.size[2] / 2] as [number, number, number];
    const actual = localToWorld(local, b.position, b.rotation), mapped = worldToMap(actual[0], actual[2]);
    const angle = mapRotation(b.rotation) * Math.PI / 180;
    assert.ok(Math.abs(mapped[0] - (x + (local[0] * Math.cos(angle) - local[2] * Math.sin(angle)) * mapScale)) < 1e-8);
    assert.ok(Math.abs(mapped[1] - (y + (local[0] * Math.sin(angle) + local[2] * Math.cos(angle)) * mapScale)) < 1e-8);
  }
  for (const q of quests) if (q.objectiveType === "talk-to-npc") assert.deepEqual(questPosition(q), npcsById[q.targetId].position);
  const html = renderToStaticMarkup(<VillageOverviewMap playerPosition={[1, 0, 2]} playerHeading={0} objective={questsById["pages-of-past"]} destination="library" />);
  for (const b of worldConfig.buildings) assert.ok(html.includes(b.name), b.id);
  for (const road of worldConfig.roads) assert.ok(html.includes(road.points.map(([x, z]) => worldToMap(x, z).join(",")).join(" ")));
  assert.ok(html.includes(`translate(${worldToMap(1, 2).join(" ")}) rotate(0)`));
  assert.ok(html.includes('data-objective="pages-of-past"'));
});

test("semantic journal reports all statuses, progress, destinations, and unrestricted HTML access", () => {
  const progress = { completedObjectives: ["tools-of-trade"] as QuestId[], selectedObjective: "pages-of-past" as QuestId };
  const html = renderToStaticMarkup(<QuestJournal progress={progress} select={() => {}} showMap={() => {}} />);
  assert.ok(html.includes("1 of 5 discovered")); assert.ok(html.includes('max="5" value="1"'));
  for (const value of ["Active", "Not started", "Completed", "Grand Library", 'href="/portfolio"']) assert.ok(html.includes(value), value);
  const all = renderToStaticMarkup(<QuestJournal progress={{ completedObjectives: quests.map((q) => q.id), selectedObjective: null }} select={() => {}} showMap={() => {}} />);
  assert.ok(all.includes(explorationCompletionMessage)); assert.ok(all.includes('href="/portfolio"'));
});
