import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Settings } from "../src/components/settings";
import { useGameStore } from "../src/stores/game-store";
import { mountModal } from "../src/systems/ui/modal-lifecycle";
import { lockDocumentScroll } from "../src/systems/ui/scroll-lock";
import { WorldShell } from "../src/components/world/world-shell";
import { WorldHUD } from "../src/components/world/hud/world-hud";
import { PauseMenu } from "../src/components/world/hud/pause-menu";
import { PlayerHUD } from "../src/components/world/player/player-hud";
import { createPlayerRuntime } from "../src/systems/player/motion";
import { useWorldDebugStore } from "../src/stores/world-debug-store";

test("existing saved settings gain a safe sensitivity; invalid values cannot affect camera motion", () => {
  const current = useGameStore.getState();
  const merge = useGameStore.persist.getOptions().merge!;
  const oldSave = merge({ graphicsQuality: "low", musicVolume: .2 }, current);
  assert.equal(oldSave.cameraSensitivity, 1);
  assert.equal(oldSave.graphicsQuality, "low");
  assert.equal(oldSave.musicVolume, .2);
  for (const value of [undefined, null, "2", NaN, Infinity]) {
    assert.equal(merge({ cameraSensitivity: value }, current).cameraSensitivity, 1);
  }
  assert.equal(merge({ cameraSensitivity: -10 }, current).cameraSensitivity, .4);
  assert.equal(merge({ cameraSensitivity: 10 }, current).cameraSensitivity, 2);
  try {
    current.setCameraSensitivity(1.6);
    const saved = useGameStore.persist.getOptions().partialize!(useGameStore.getState());
    assert.equal(merge(saved, current).cameraSensitivity, 1.6);
    assert.deepEqual(Object.keys(saved as object).sort(), ["cameraSensitivity", "graphicsQuality", "musicVolume", "playerPreferences", "soundEffectsVolume"]);
  } finally { current.setCameraSensitivity(1); }
});

test("settings have named groups and labelled controls, with honest audio availability", () => {
  const html = renderToStaticMarkup(<Settings />);
  for (const id of ["camera-sensitivity", "music-volume", "effects-volume"]) {
    assert.ok(html.includes(`for="${id}"`));
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.match(html, /<legend>View &amp; movement<\/legend>/);
  assert.match(html, /<legend>Sound preferences<\/legend>/);
  assert.match(html, /<legend>Comfort<\/legend>/);
  assert.match(html, /audio|sound/i);
  assert.match(html, /No music or sound effects play yet/);
  assert.match(html, /Reduce interface motion/);
});

test("modal lifecycle focuses the heading, restores scroll and trigger, and protects handoff focus", async () => {
  const dialogs: FakeDialog[] = [];
  class Element {
    isConnected = true;
    disabled = false;
    focusable = true;
    hiddenContainer: Element | null = null;
    matches() { return this.disabled; }
    closest() { return this.hiddenContainer; }
    focus() { if (this.focusable) documentState.activeElement = this; }
  }
  class FakeDialog extends Element {
    open = false;
    constructor() { super(); dialogs.push(this); }
    showModal() { this.open = true; }
    close() { this.open = false; }
  }
  const trigger = new Element();
  const documentState = {
    activeElement: trigger,
    body: { style: { overflow: "clip", overscrollBehavior: "auto" } },
    documentElement: { style: { overflow: "auto", overscrollBehavior: "contain" } },
    querySelector: () => dialogs.find((dialog) => dialog.open) ?? null,
  };
  const originals = ["document", "HTMLElement"].map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const);
  Object.defineProperty(globalThis, "document", { configurable: true, value: documentState });
  Object.defineProperty(globalThis, "HTMLElement", { configurable: true, value: Element });
  const mount = (heading: Element, afterClose?: () => void) => mountModal(new FakeDialog() as unknown as HTMLDialogElement, heading as unknown as HTMLElement, afterClose);
  try {
    const heading = new Element();
    let fallbackCalls = 0;
    const close = mount(heading, () => fallbackCalls++);
    assert.equal(documentState.activeElement, heading);
    assert.equal(documentState.body.style.overflow, "hidden");
    close(); await Promise.resolve();
    assert.equal(documentState.activeElement, trigger);
    assert.equal(fallbackCalls, 0, "a valid HUD invoker must retain focus instead of being overridden by canvas fallback");
    assert.equal(documentState.body.style.overflow, "clip");

    let callbacks = 0;
    const closeConversation = mount(heading, () => callbacks++);
    closeConversation();
    const portfolioHeading = new Element();
    const closePortfolio = mount(portfolioHeading);
    await Promise.resolve();
    assert.equal(documentState.activeElement, portfolioHeading);
    assert.equal(callbacks, 0, "a previous canvas focus callback must not run over a new modal");
    assert.equal(documentState.body.style.overflow, "hidden");
    closePortfolio(); await Promise.resolve();
    assert.equal(documentState.body.style.overflow, "clip");

    trigger.focus();
    const closeOuter = mount(heading);
    const closeInner = mount(new Element());
    closeInner(); await Promise.resolve();
    assert.equal(documentState.body.style.overflow, "hidden");
    closeOuter(); await Promise.resolve();
    assert.equal(documentState.body.style.overflow, "clip");

    trigger.focus();
    const fallback = new Element();
    const closeRemovedTrigger = mount(heading, () => fallback.focus());
    trigger.isConnected = false;
    closeRemovedTrigger(); await Promise.resolve();
    assert.equal(documentState.activeElement, fallback);

    trigger.isConnected = true; trigger.focus();
    const closeHiddenTrigger = mount(heading, () => fallback.focus());
    trigger.hiddenContainer = new Element();
    closeHiddenTrigger(); await Promise.resolve();
    assert.equal(documentState.activeElement, fallback, "a trigger in a closed dialog/details must use the canvas fallback");
    trigger.hiddenContainer = null; trigger.focus();
    const closeDisabledTrigger = mount(heading, () => fallback.focus());
    trigger.disabled = true;
    closeDisabledTrigger(); await Promise.resolve();
    assert.equal(documentState.activeElement, fallback);
    trigger.disabled = false; trigger.focus();
    const closeInvisibleTrigger = mount(heading, () => fallback.focus());
    trigger.focusable = false;
    closeInvisibleTrigger(); await Promise.resolve();
    assert.equal(documentState.activeElement, fallback, "failed focus restoration must still fall back safely");
    trigger.focusable = true;

    const leaveWorld = lockDocumentScroll();
    const closeInWorld = mount(heading);
    closeInWorld(); await Promise.resolve();
    assert.equal(documentState.body.style.overflow, "hidden", "closing an overlay must not unlock the world route");
    assert.equal(documentState.documentElement.style.overscrollBehavior, "none");
    leaveWorld(); leaveWorld();
    assert.equal(documentState.body.style.overflow, "clip");
    assert.equal(documentState.documentElement.style.overflow, "auto");
    assert.equal(documentState.documentElement.style.overscrollBehavior, "contain");

    const leaveWorldFirst = lockDocumentScroll();
    const closeAfterNavigation = mount(heading);
    leaveWorldFirst();
    assert.equal(documentState.body.style.overflow, "hidden", "unmounting the route must preserve a live overlay's lock");
    closeAfterNavigation(); await Promise.resolve();
    assert.equal(documentState.body.style.overflow, "clip");
    assert.equal(documentState.body.style.overscrollBehavior, "auto");

    const brokenDialog = new FakeDialog();
    brokenDialog.showModal = () => { throw new Error("Dialog unavailable"); };
    assert.throws(() => mountModal(brokenDialog as unknown as HTMLDialogElement, null), /Dialog unavailable/);
    assert.equal(documentState.body.style.overflow, "clip", "failed native dialog mounting must release its lock");
  } finally {
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor); else Reflect.deleteProperty(globalThis, name);
    }
  }
});

test("world shell and HUD provide semantic exploration controls without document-style chrome", () => {
  const shell = renderToStaticMarkup(<WorldShell><div data-scene="true" /></WorldShell>);
  assert.match(shell, /<main[^>]*id="main-content"/);
  assert.match(shell, /<h1 class="sr-only">The Village of Riyan<\/h1>/);
  assert.match(shell, /data-scene="true"/);
  assert.doesNotMatch(shell, /<header|<footer|medieval-interface|world-heading|world-viewport|village-directory/);
  const hud = renderToStaticMarkup(<WorldHUD />);
  for (const name of ["Open quest journal", "Open village map", "Open settings", "Exit village to main menu"]) assert.ok(hud.includes(`aria-label="${name}"`));
  assert.match(hud, /href="\/"/);
  assert.doesNotMatch(hud, /href="\/portfolio"|Debug|player diagnostics|site-header|exploration-toolbar/);
  const controls = renderToStaticMarkup(<PlayerHUD runtime={{ current: createPlayerRuntime() }} restoreFocus={() => {}} />);
  assert.match(controls, /<details class="player-controls"/);
  assert.match(controls, /Walk forward/);
  assert.match(controls, /Move camera closer/);
  assert.doesNotMatch(controls, /Debug|Player diagnostics|player-toolbar/);
});

test("manual pause keeps conventional routes available and developer UI state never persists", () => {
  const html = renderToStaticMarkup(<PauseMenu restoreFocus={() => {}} />);
  assert.match(html, /world-overlay/);
  assert.match(html, /Resume exploration/);
  assert.match(html, /href="\/portfolio"/);
  assert.match(html, /href="\/"/);
  useWorldDebugStore.getState().setVisible(true);
  useWorldDebugStore.getState().setColliders(true);
  assert.ok(!("persist" in useWorldDebugStore));
  useWorldDebugStore.getState().reset();
  assert.equal(useWorldDebugStore.getState().visible, false);
  assert.equal(useWorldDebugStore.getState().colliders, false);
});

test("text token pairs meet WCAG AA normal-text contrast; focus rings remain distinct", () => {
  const css = readFileSync("src/app/styles/tokens.css", "utf8");
  const colors = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[\da-f]{6});/gi)].map((match) => [match[1], match[2]]));
  const luminance = (name: string) => {
    assert.ok(colors[name], `Missing color token: ${name}`);
    const channels = colors[name].slice(1).match(/../g)!.map((hex) => parseInt(hex, 16) / 255)
      .map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const contrast = (a: string, b: string) => {
    const first = luminance(a), second = luminance(b);
    return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
  };
  for (const foreground of ["ink", "muted", "forest", "gold-ink", "wood"]) {
    for (const background of ["paper", "paper-raised", "paper-shade"]) {
      assert.ok(contrast(foreground, background) >= 4.5, `${foreground}/${background}: ${contrast(foreground, background).toFixed(2)}`);
    }
  }
  for (const [foreground, background] of [["paper-raised", "forest"], ["paper-raised", "forest-hover"], ["paper-raised", "walnut"], ["gold-light", "walnut"]]) {
    assert.ok(contrast(foreground, background) >= 4.5, `${foreground}/${background}`);
  }
  assert.ok(contrast("focus", "paper") >= 3);
  assert.ok(contrast("paper", "walnut") >= 3, "light halo distinguishes focus on dark surfaces");
});

test("bundled fonts are intact WOFF2 files accompanied by redistribution licenses", () => {
  for (const [font, hash, license] of [
    ["cinzel-latin-600.woff2", "61efc27ceb7d08bb841652fa8979c0b6833b92548b7f9544c07968a6c02f28e4", "Cinzel-OFL.txt"],
    ["source-sans-3-latin.woff2", "19143dca075972bc84e3fd9eab7416dd40cc565dccb2435a044bdfabe060c7d5", "SourceSans3-OFL.txt"],
  ]) {
    const bytes = readFileSync(`public/assets/fonts/${font}`);
    assert.equal(bytes.subarray(0, 4).toString(), "wOF2");
    assert.equal(createHash("sha256").update(bytes).digest("hex"), hash);
    assert.match(readFileSync(`public/assets/fonts/${license}`, "utf8"), /SIL OPEN FONT LICENSE Version 1.1/);
  }
});
