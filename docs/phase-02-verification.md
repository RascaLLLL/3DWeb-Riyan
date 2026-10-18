# Phase 02 — Medieval world environment

Verified on 18 October 2026 with Node 24.15.0 on Windows.

## Delivered and modified files

- `src/types/world.ts`: typed landmarks, roads, props, nature placement, static
  obstacles, reusable geometry/material identifiers, and instance records.
- `src/data/world.ts`: five landmark IDs/names, transforms, dimensions,
  interaction anchors, oriented collision dimensions, portfolio associations,
  connected road control points, prop coordinates, spawn, terrain bounds,
  scenery seeds, camera, and lighting.
- `src/systems/world/part-builder.ts`: local part construction and one-time
  world transform composition.
- `src/systems/world/buildings.ts`: timber houses, four roof styles, foundations,
  beams, windows, doors, chimneys, guild porch, cottage planters, library tower,
  forge workshop/anvil/hearth, and the twin-tower gate.
- `src/systems/world/props.ts`: well, notice board, benches, lantern posts,
  striped stalls, barrels, crates, hay bales, cart, and fences.
- `src/systems/world/landscape.ts`: deterministic vegetation/flowers, road
  clearance, cobblestone/dirt surfaces, grass patches, boundary rocks, and
  static obstacle preparation.
- `src/systems/world/village-model.ts`: static model composition returning
  instance parts, nature placements, and future obstacles.
- `src/components/world/environment/scene-resources.ts`, `static-instances.tsx`:
  seven shared geometry types, reusable materials, batched rendering, and
  resource/instance buffer cleanup.
- `src/components/world/environment/terrain.tsx`: finite vertex-colored terrain
  with a flat center, outer rise, and visible earth sides.
- `src/components/world/environment/landmark-labels.tsx`: numbered HTML labels
  in the page root; demand-frame projection reuses a scratch vector.
- `src/components/world/development-camera.tsx`, `village-scene.tsx`: responsive
  temporary orbit camera, warm sunlight, ambient/hemisphere light, fog, shadows,
  and scene composition.
- `src/components/world/world-canvas.tsx`, `world-client.tsx`: village loading,
  PCF shadow configuration, label layer, and retained WebGL/error fallbacks.
- Removed `src/components/world/foundation-scene.tsx`; the village replaces the
  single-marker scene.
- `src/app/world/page.tsx`, `src/app/globals.css`: environment presentation,
  five numbered landmark directory links, and responsive scene/directory styles.
- `tests/world-config.test.mjs`, `package.json`: four meaningful configuration
  checks and the `test:world` command.
- `README.md`, `public/assets/README.md`: architecture, phase plan, asset
  replacement policy, and manual verification updated for the environment.

## Decisions

The village spans approximately 76 world units. The five landmarks face a
furnished square and have distinct silhouettes, roofs, names, and directory
numbers. Roads use their derived approaches/thresholds. Trees and rocks avoid
roads and reserved building/prop areas; wooded boulder ridges form the boundary,
with a road through the gate.

All assets are original procedural geometry. No external pack, texture, font,
GLB, remote model reference, or download is required. Replacement points for
future verified models are documented in the asset README.

Static parts are batched by shared geometry/material rather than using one
draw call for every cobblestone, beam, or leaf. No post-processing or continuous
animation is introduced. Rendering remains on demand, pixel ratio is capped,
and quality settings control shadows. The HTML label layer avoids nested DOM
roots in the Three renderer. Mobile labels use directory numbers and the
initial camera fits narrow viewports.

No dependencies were installed, removed, or upgraded in this phase. The Node
test runner and existing TypeScript package run the configuration checks.

## Verification results

| Check | Result |
| --- | --- |
| `npm run test:world` | 4 passed, 0 failed |
| `npm run lint` | Passed without warnings |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; `/`, `/world`, `/portfolio` prerendered |
| `npm ls --depth=0` | Passed; installed versions unchanged |
| Development server | Started successfully |
| HTTP route smoke checks | All three returned 200 |
| Desktop browser | Village, all five labels, connected roads, square, props, and finite scenery visually confirmed |
| Temporary camera | Pointer orbit and scroll zoom exercised; second viewing angle inspected |
| Settings | Low → high → medium retained the village; Escape closed settings |
| Scene lifecycle | Directory → portfolio → menu → world navigation succeeded without errors |
| Directory link | Guild link opened the Projects section |
| Mobile | 390 × 844 checked; no horizontal overflow, five numbered labels, full directory in HTML |
| Raw HTML | World directory present in HTTP response independently of the canvas |
| Final clean browser pass | No console errors; existing nonfatal `THREE.Clock` deprecation warning remains |

## Limitations

- Collision boxes and interaction anchors are data only. No Rapier simulation,
  player controller, navigation system, building entry, or NPC dialogue is active.
  Boxes are conservative and require refinement/testing with a real controller.
- No frame-rate, GPU-memory, or measured renderer draw-call benchmark was run.
  Batching is implemented; device-specific performance is not claimed.
- Physical mobile gestures, a full assistive-technology audit, forced context
  loss, and a fresh Vercel deployment were not tested in this phase.
- The orbit camera is a temporary inspection tool. It does not enforce scene
  collisions or movement boundaries. Right-drag panning remains available but
  was not separately exercised in the final browser pass.
- Existing dependency audit/tool support notes from Phase 01 remain in README;
  this phase did not change that dependency graph or rerun the registry audit.
- Portfolio entries remain explicit empty states pending approved information.

## Manual testing

1. Run `npm run dev`, then open `/world`.
2. Identify the cottage, red-roofed guild, dark forge, tall library, and gate.
3. Orbit and zoom to inspect the well, board, benches, lanterns, stalls, cart,
   hay, fences, plants, and finite wooded boundary.
4. Follow each visible road from the square to its landmark entrance. Inspect
   the open gate passage and clear central through-route.
5. Change low/medium/high graphics quality. Close settings with Escape.
6. Open a directory link, return through the menu, and re-enter the village.
7. Resize to a narrow mobile viewport. Match numbered markers to the directory;
   confirm readable HTML links and no horizontal page overflow.
8. Run `npm run test:world`, `npm run lint`, `npm run typecheck`, and `npm run build`.

Phase 02 acceptance criteria are met in the tested local environment. Movement
and dialogue remain outside this phase, as requested.
