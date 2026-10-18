import type { BuildingDefinition } from "@/types/world";
import { PartBuilder } from "./part-builder";

function windowAt(b: PartBuilder, x: number, y: number, z: number, large = false) {
  const w = large ? 1.2 : .85, h = large ? 1.7 : 1.1;
  b.box("woodLight", [x, y, z], [w + .24, h + .24, .16]);
  b.box("glass", [x, y, z + .1], [w, h, .08]);
  b.box("timber", [x, y, z + .17], [.07, h, .07]);
  b.box("timber", [x, y, z + .17], [w, .07, .07]);
  b.box("wood", [x, y - h / 2, z + .2], [w + .35, .12, .45]);
  for (const side of [-1, 1]) b.box("wood", [x + side * (w / 2 + .24), y, z], [.25, h, .12]);
}

export function buildHouse(definition: BuildingDefinition) {
  if (definition.id === "gate") return buildGate();
  const b = new PartBuilder();
  const [w, h, d] = definition.size;
  const roofHeight = definition.id === "library" ? 3.3 : definition.id === "guild" ? 2.8 : 2.2;
  b.box("stone", [0, .28, 0], [w + .3, .56, d + .3]);
  b.box("plaster", [0, (h + .5) / 2, 0], [w, h - .5, d]);
  b.add("roof", definition.roof, [0, h, 0], [w + 1, roofHeight, d + 1]);
  // Plaster gables sit just inside the eaves; dark beams describe the roof frame.
  b.add("roof", "plaster", [0, h - .01, 0], [w - .35, roofHeight - .2, d + 1.02]);
  for (const z of [-d / 2 - .53, d / 2 + .53]) {
    b.beam("timber", [-w / 2 - .48, h, z], [0, h + roofHeight, z], .18);
    b.beam("timber", [w / 2 + .48, h, z], [0, h + roofHeight, z], .18);
    b.box("timber", [0, h + roofHeight / 2, z], [.16, roofHeight, .16]);
    b.box("timber", [0, h, z], [w + .8, .18, .2]);
  }
  b.box("timber", [0, h + roofHeight, 0], [.2, .18, d + 1.2]);
  // Timber framing on all four sides, not only the camera-facing facade.
  for (const x of [-w / 2, 0, w / 2]) {
    for (const z of [-d / 2 - .06, d / 2 + .06]) b.box("timber", [x, h / 2 + .25, z], [.2, h - .3, .17]);
  }
  for (const x of [-w / 2 - .06, w / 2 + .06]) {
    for (const z of [-d / 2, 0, d / 2]) b.box("timber", [x, h / 2 + .25, z], [.17, h - .3, .2]);
    for (const y of [.7, h * .56, h]) b.box("timber", [x, y, 0], [.17, .18, d]);
    b.beam("timber", [x, .8, -d / 2], [x, h * .56, 0], .13);
    b.beam("timber", [x, h * .56, 0], [x, .8, d / 2], .13);
  }
  for (const y of [.7, h * .56, h]) {
    for (const z of [-d / 2 - .08, d / 2 + .08]) b.box("timber", [0, y, z], [w, .18, .15]);
  }
  const front = d / 2 + .13;
  b.box("timber", [0, 1.4, front], [1.6, 2.6, .18]);
  b.box("wood", [0, 1.3, front + .11], [1.25, 2.3, .12]);
  for (const x of [-.4, -.2, 0, .2, .4]) b.box("woodLight", [x, 1.3, front + .19], [.025, 2.25, .02]);
  for (const y of [.65, 1.9]) b.box("iron", [0, y, front + .21], [1.2, .09, .05]);
  b.add("sphere", "iron", [.4, 1.2, front + .28], [.09, .09, .09]);
  b.box("stoneLight", [0, .15, front + .45], [1.9, .3, 1]);
  for (const x of [-w * .32, w * .32]) windowAt(b, x, 1.8, front, definition.id === "library");
  if (h > 4) {
    for (const x of [-w * .3, w * .3]) windowAt(b, x, h - 1.05, front, definition.id === "library");
    for (const x of [-w * .4, w * .4]) b.beam("timber", [x - .6, h * .58, front], [x + .6, h - .18, front], .13);
  }
  const chimneyX = -w * .3;
  if (definition.id !== "forge") {
    b.box("stone", [chimneyX, h + roofHeight * .67, -d * .22], [.8, 2.8, .85]);
    b.box("stoneLight", [chimneyX, h + roofHeight * .67 + 1.4, -d * .22], [1.05, .23, 1.1]);
    b.box("iron", [chimneyX, h + roofHeight * .67 + 1.53, -d * .22], [.6, .03, .65]);
  }
  if (definition.id === "guild") {
    // Broad entrance canopy and hanging shield.
    b.add("roof", "terracotta", [0, 2.8, front + .7], [2.8, .8, 1.8]);
    for (const x of [-1.2, 1.2]) b.box("timber", [x, 1.4, front + 1.4], [.14, 2.8, .14]);
    b.box("wood", [w / 2 + .5, 4.3, front], [1.3, 1.8, .2]);
    b.box("canvas", [w / 2 + .5, 4.3, front + .12], [1, 1.45, .05]);
    b.beam("terracotta", [w / 2 + .15, 3.9, front + .17], [w / 2 + .85, 4.7, front + .17], .13);
    b.beam("terracotta", [w / 2 + .85, 3.9, front + .17], [w / 2 + .15, 4.7, front + .17], .13);
  }
  if (definition.id === "cottage") {
    for (const x of [-w * .32, w * .32]) {
      b.box("wood", [x, 1, front + .35], [1.3, .35, .45]);
      for (let i = 0; i < 4; i++) {
        b.add("sphere", "leaf", [x - .45 + i * .3, 1.25, front + .35], [.25, .25, .25]);
        b.add("sphere", i % 2 ? "flower" : "flowerGold", [x - .45 + i * .3, 1.45, front + .35], [.12, .12, .12]);
      }
    }
  }
  if (definition.id === "library") {
    const tx = w / 2 + 1.1, tz = -.7;
    b.add("cylinder", "stone", [tx, 4.1, tz], [1.7, 8.2, 1.7]);
    b.add("cylinder", "stoneLight", [tx, 7.8, tz], [1.83, .35, 1.83]);
    b.add("cone", "slate", [tx, 9.5, tz], [2.1, 3.3, 2.1]);
    b.add("sphere", "woodLight", [tx, 11.2, tz], [.15, .15, .15]);
    b.box("glass", [tx, 6.3, tz + 1.65], [.65, 1.35, .12]);
    b.box("woodLight", [tx, 6.3, tz + 1.73], [.08, 1.35, .08]);
    // Open-book emblem above the entrance.
    b.box("wood", [0, 3.5, front + .2], [1.5, .9, .1]);
    b.box("canvas", [-.33, 3.5, front + .3], [.58, .65, .08], [0, -.18, 0]);
    b.box("canvas", [.33, 3.5, front + .3], [.58, .65, .08], [0, .18, 0]);
  }
  if (definition.id === "forge") buildForge(b, w, d, front);
  return b.parts;
}

function buildForge(b: PartBuilder, w: number, d: number, front: number) {
  // Open-sided lean-to: no closed wall obscures the hearth and anvil.
  b.box("darkRoof", [0, 3, front + 1.7], [w + .5, .22, 3.7], [.12, 0, 0]);
  for (const x of [-w / 2, w / 2]) b.box("timber", [x, 1.5, front + 3.2], [.2, 3, .2]);
  b.box("stone", [-2, .7, front + 1.2], [2, 1.4, 1.4]);
  b.box("iron", [-2, 1.3, front + 1.95], [1.35, .7, .06]);
  b.box("lantern", [-2, 1.22, front + 2], [.9, .18, .1]);
  b.box("stone", [-w / 2 + .35, 4, d / 2 - .5], [1.15, 8, 1.3]);
  b.box("stoneLight", [-w / 2 + .35, 8, d / 2 - .5], [1.5, .3, 1.6]);
  b.add("cylinder", "wood", [1.4, .5, front + 1.8], [.5, 1, .5]);
  b.box("iron", [1.4, 1.1, front + 1.8], [1, .3, .5]);
  b.box("iron", [1.4, 1.32, front + 1.8], [1.5, .18, .65]);
  b.add("cone", "iron", [2.25, 1.32, front + 1.8], [.32, .65, .32], [0, 0, -Math.PI / 2]);
}

function buildGate() {
  const b = new PartBuilder();
  for (const x of [-4.6, 4.6]) {
    b.box("stone", [x, 3.1, 0], [3.2, 6.2, 3.4]);
    b.box("stoneLight", [x, .35, 0], [3.6, .7, 3.8]);
    b.box("stoneLight", [x, 5.9, 0], [3.5, .35, 3.7]);
    b.add("cone", "slate", [x, 7.3, 0], [2.65, 2.7, 2.65], [0, Math.PI / 4, 0]);
    b.box("glass", [x, 4.1, 1.75], [.45, 1.3, .08]);
    b.box("timber", [x, 9, 0], [.1, 1, .1]);
    b.box("greenCanvas", [x + .6, 9.2, 0], [1.2, .7, .04]);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) b.box("stoneLight", [x - 1.05 + col * 1.05 + (row % 2 ? .2 : 0), .9 + row * 1.03, 1.72], [.85, .06, .04]);
    }
  }
  b.box("stone", [0, 5.5, 0], [6.2, 1.2, 2.5]);
  b.box("stoneLight", [0, 6.2, 0], [6.6, .25, 2.9]);
  for (const x of [-2.75, 2.75]) b.box("timber", [x, 2.5, .1], [.3, 5, .35]);
  // Raised portcullis leaves a clear four-unit entrance for a future player.
  for (let i = -4; i <= 4; i++) b.box("iron", [i * .53, 4.9, .15], [.08, 1.2, .08]);
  b.box("wood", [0, 5.6, 1.32], [4.4, .65, .13]);
  return b.parts;
}
