import type { PropKind } from "@/types/world";
import { PartBuilder } from "./part-builder";

export function buildProp(kind: PropKind, variant = 0) {
  const b = new PartBuilder();
  switch (kind) {
    case "barrel":
      b.add("cylinder", "wood", [0, .55, 0], [.48, 1.1, .48]);
      for (const y of [.17, .88]) b.add("torus", "iron", [0, y, 0], [.48, .48, .48], [Math.PI / 2, 0, 0]);
      b.add("cylinder", "woodLight", [0, 1.12, 0], [.44, .05, .44]);
      break;
    case "crate":
      b.box("wood", [0, .5, 0], [1, 1, 1]);
      for (const x of [-.42, .42]) b.box("woodLight", [x, .5, .52], [.13, 1, .07]);
      for (const y of [.1, .9]) b.box("woodLight", [0, y, .52], [1, .13, .07]);
      b.beam("woodLight", [-.4, .1, .56], [.4, .9, .56], .1);
      break;
    case "hay":
      b.box("hay", [0, .38, 0], [1.5, .75, .9]);
      for (const x of [-.45, .45]) b.box("wood", [x, .39, 0], [.05, .79, .94]);
      break;
    case "fence":
      for (const x of [-1.5, 1.5]) b.box("wood", [x, .75, 0], [.18, 1.5, .2]);
      for (const y of [.55, 1.1]) b.box("woodLight", [0, y, 0], [3, .15, .12]);
      break;
    case "bench":
      for (const x of [-.9, .9]) {
        b.box("timber", [x, .4, 0], [.16, .8, .65]);
        b.box("timber", [x, .9, -.25], [.13, 1.4, .13]);
      }
      for (const z of [-.22, 0, .22]) b.box("woodLight", [0, .85, z], [2.4, .12, .18]);
      for (const y of [1.2, 1.5]) b.box("wood", [0, y, -.3], [2.4, .2, .12]);
      break;
    case "lantern":
      b.box("stone", [0, .2, 0], [.6, .4, .6]);
      b.box("timber", [0, 1.9, 0], [.16, 3.8, .16]);
      b.box("timber", [.45, 3.6, 0], [1.1, .15, .15]);
      b.beam("timber", [0, 3, 0], [.65, 3.6, 0], .1);
      b.box("iron", [.8, 3.15, 0], [.48, .7, .48]);
      b.box("lantern", [.8, 3.17, .02], [.35, .45, .37]);
      b.add("cone", "iron", [.8, 3.65, 0], [.4, .25, .4]);
      break;
    case "well":
      // Individual wedge-like stones form a visibly open ring.
      for (let row = 0; row < 3; row++) {
        for (let i = 0; i < 12; i++) {
          const angle = (i + (row % 2) * .5) * Math.PI / 6;
          b.box(i % 3 ? "stone" : "stoneLight", [Math.sin(angle) * 1.15, .23 + row * .38, Math.cos(angle) * 1.15], [.57, .35, .42], [0, angle, 0]);
        }
      }
      b.add("cylinder", "water", [0, .65, 0], [.96, .06, .96]);
      for (const x of [-1.65, 1.65]) b.box("timber", [x, 1.6, 0], [.22, 3.2, .22]);
      b.add("roof", "terracotta", [0, 3.1, 0], [4.1, 1.25, 2.8]);
      b.add("cylinder", "woodLight", [0, 2.35, 0], [.12, 3.4, .12], [0, 0, Math.PI / 2]);
      b.box("wood", [0, 1.65, 0], [.04, 1.4, .04]);
      b.add("cylinder", "wood", [0, 1, 0], [.25, .4, .25]);
      break;
    case "noticeBoard":
      for (const x of [-1, 1]) b.box("timber", [x, 1.3, 0], [.18, 2.6, .18]);
      b.box("wood", [0, 1.95, 0], [2.5, 1.5, .2]);
      b.add("roof", "darkRoof", [0, 2.75, 0], [3.1, .55, .9]);
      for (let i = 0; i < 4; i++) {
        b.box("canvas", [-.8 + (i % 2) * 1.1, 1.7 + Math.floor(i / 2) * .55, .12], [.7, .43, .025], [0, 0, (i - 1.5) * .04]);
        b.box("woodLight", [-.8 + (i % 2) * 1.1, 1.7 + Math.floor(i / 2) * .55, .14], [.42, .025, .02]);
      }
      break;
    case "stall":
      for (const x of [-1.6, 1.6]) for (const z of [-.8, .8]) b.box("timber", [x, 1.4, z], [.12, 2.8, .12]);
      b.box("wood", [0, 1, 0], [3.6, .18, 1.8]);
      for (let i = 0; i < 6; i++) {
        const material = i % 2 ? "canvas" : variant ? "greenCanvas" : "terracotta";
        b.box(material, [-1.5 + i * .6, 2.9, 0], [.6, .08, 2.4], [-.13, 0, 0]);
        b.box(material, [-1.5 + i * .6, 2.65, 1.16], [.6, .35, .08]);
        b.add("sphere", variant ? "leafLight" : "flowerGold", [-1.2 + i * .45, 1.2, .1], [.23, .2, .23]);
      }
      b.box("woodLight", [0, .55, .8], [3.4, .8, .1]);
      break;
    case "cart":
      b.box("wood", [0, .8, 0], [1.6, .18, 2.2]);
      for (const x of [-.8, .8]) {
        for (const y of [1, 1.3]) b.box("woodLight", [x, y, 0], [.12, .2, 2.2]);
        b.box("timber", [x, .65, 2], [.12, .12, 2.5]);
        b.add("torus", "timber", [x * 1.2, .55, 0], [.57, .57, .57], [0, Math.PI / 2, 0]);
        for (let i = 0; i < 4; i++) b.box("woodLight", [x * 1.2, .55, 0], [.06, 1.05, .06], [Math.PI / 4 * i, 0, 0]);
      }
      b.box("hay", [0, 1.2, -.3], [1.3, .6, 1.4]);
      break;
  }
  return b.parts;
}
