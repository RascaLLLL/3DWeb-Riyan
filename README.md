# The Village of Riyan

A medieval personal portfolio built with Next.js App Router, React, TypeScript,
Tailwind CSS, and React Three Fiber. Phases 01–03 provide the foundation,
procedural village, and playable civilian with Rapier collision and a follow
camera. NPCs, quests, and approved portfolio entries have not been added yet.

## Installation

Use Node.js 20.9 or newer (Node 24 recommended) and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For reproducible installations after cloning, use
`npm ci` with the committed package-lock.json.

## Commands

```sh
npm run dev        # Development server
npm run lint       # ESLint with Next.js and TypeScript rules
npm run typecheck  # Generate route types, then strict TypeScript checking
npm run test:world # World layout, road, anchor, and gate configuration checks
npm run test:player # Motion, real Rapier collision, camera, and input lifecycle tests
npm test           # Both suites
npm run build      # Production build
npm start          # Serve the production build
```

## Routes

- `/`: responsive main menu, original illustrated concept map, and settings.
- `/world`: client-only WebGL2 village with five landmarks, a furnished square,
  connected cobblestone/dirt roads, woodland boundaries, and an HTML directory.
  Click/focus the scene, then WASD/arrows to walk, Shift to run, E to wave,
  Escape to pause. Drag to rotate the third-person camera. Scroll or use +/−
  for distance. Small screens offer directional buttons and a Run toggle.
- `/portfolio`: server-rendered HTML portfolio with section navigation;
  independent of WebGL and readable with JavaScript disabled. Explicit empty
  states remain until verified portfolio information is supplied.

## Architecture

```text
src/app/                 App Router pages, global styling, route loading UI
src/components/ui/       Button, Panel, Modal, LoadingIndicator, SectionHeading,
                         MedievalInterface
src/components/menu/     Original SVG concept illustration
src/components/world/    Client loader, canvas, scene composition, environment
src/components/world/player/ Articulated civilian, controller, follow camera, HUD
src/components/world/physics/ Static Rapier colliders
src/data/                Typed portfolio content and centralized world layout
src/hooks/               Browser capability hooks
src/stores/              Zustand state and persisted preferences
src/systems/world/       Deterministic static geometry builders, placement,
                         shared terrain mesh data, roads, and collision data
src/systems/player/      Mutable simulation, input lifecycle, character controller,
                         camera obstruction queries
src/systems/             Graphics presets and persistence adapter
src/types/               Shared content and state contracts
public/assets/           Optional assets and license/replacement documentation
tests/                   World configuration and player/physics tests
```

The canvas is loaded with `ssr: false` from a client component and only on
`/world`. Active gameplay renders continuously; manual/blocking pause switches
to on-demand rendering and pauses physics. Pixel ratio and shadows follow quality.
HTML navigation remains available around the scene. WebGL unavailability,
render errors, and context loss expose an HTML fallback link.

## Village environment

`src/data/world.ts` is the world placement source. It defines stable building
IDs/names, positions, yaw rotation, dimensions, world-space interaction anchors,
oriented collision boxes, portfolio associations, roads, props, terrain bounds,
spawn, camera, lighting, and scenery seeds. Change a building's transform there;
its approach and road endpoint are derived from it. The resident spawns near the
water well using the shared spawn configuration.

The five landmarks are Player Cottage, Adventurer's Guild, Blacksmith Forge,
Grand Library, and Kingdom Gate. The well and notice board sit to either side
of the main through-route. Two stalls, lanterns, benches, barrels, crates, hay,
a cart, and fences furnish the square and approaches. Tree/rock placement keeps
away from the roads, props, and building footprints.

The terrain has a flat walkable center and a low faceted outer rise with trees
and boulders. Its finite footprint is about 76 world units across. No infinite
plane, external textures/models, or post-processing is used. Warm sunlight,
hemisphere/ambient lighting, fog, and quality-dependent
PCF shadows provide the atmosphere.

Geometry builders emit local static parts. `PartBuilder` applies world
transforms once. `StaticInstances` batches those parts by shared geometry and
material, including house beams, roof components, stones, foliage, flowers, and
props. Terrain uses one vertex-colored geometry. Landmark labels live in the
page's HTML root; one reused vector projects five positions. The directory
remains available without the canvas. Mobile labels use directory numbers.

`createVillageModel()` returns `parts`, seeded `nature`, and `obstacles`.
Obstacle centers and half-extents use world units; `rotation` is yaw in radians.
Phase 03 instantiates these as fixed Rapier colliders. Buildings include auxiliary
tower/porch/forge obstacles; separate gate towers/high lintel preserve its passage.
Trees, rocks, props, and wooded boundaries have conservative colliders. The
rendered terrain and its trimesh share exact vertices. Smooth road/plaza
colliders avoid per-cobblestone jitter; roof hulls support camera queries. A finite
perimeter below the ridge prevents leaving the map through the gate gap.

`npm run test:world` checks five unique landmarks, finite positive dimensions,
one road per destination, approach coverage, clear building approaches/spawn,
and the gate opening. It transpiles the type-only-import configuration in
memory with the existing TypeScript dependency; no additional runtime package
is required by that suite. The player suite uses tsx and the actual pinned Rapier
WASM runtime. Neither suite is a GPU performance benchmark.

## Resident and controls

The capsule is kinematic and position based. Rapier's character controller runs
at 60 fixed steps per second, with interpolation, a small contact offset, slope
limits, autostepping, ground snap, and explicit gravity. Movement is normalized
and relative to camera yaw. Acceleration, deceleration, and shortest-angle turns
are smoothed. No jump or combat controls are included.

`src/data/player.ts` owns tuning. `src/types/player.ts` defines the animation and
movement contracts. Runtime position, velocity, heading, movement state, animation,
input, and camera values live in a ref. Fixed physics steps and Three frame
updates mutate this runtime through simulation functions; no React/Zustand state
is written each frame. States are idle, walking, running, interacting, and paused;
turning is a visual animation state layered over directional movement.

The original low-poly resident has a beige tunic, belt, brown boots, and satchel.
`CivilianCharacter` receives the runtime and uses a feet origin facing +Z,
independent of the capsule. Its idle, stride, run, turning lean, and wave animation
use articulated groups. E/Wave is a standalone friendly gesture, not an NPC or
building interaction. A future compatible rigged GLB should replace only this
visual, use AnimationMixer with mapped clips, and retain the procedural fallback;
see the asset policy. No GLB or AnimationMixer path is claimed to be running now.

The follow camera smooths its target, yaw, pitch, and distance. Sphere sweeps
against Rapier geometry shorten it when obstructed; a second sweep protects the
smoothed path around corners. Very close obstruction hides the resident when
the camera would otherwise sit inside the body. Camera motion has no shake or
walking bob. Reduced motion disables decorative idle/stride bob while preserving
the player's deliberate locomotion.

Keyboard input activates only when the canvas has focus. Editable controls,
links, buttons, contenteditable regions, and blocking panels do not receive game
input. Blur/visibility/focus changes clear held keys and release camera capture;
all DOM listeners and store subscriptions are removed on unmount. Re-focus the
scene and press keys again to continue. Manual pause survives opening/closing
Settings, and runtime pause flags are never persisted.

Development builds include a Debug button with position, state, speed, heading,
ground contact, obstruction, and camera values plus optional collider wireframes.
Text updates at 4 Hz directly through an output ref. Production has no debug
button, wireframe option, or diagnostic output.

Zustand holds `gameStarted`, `gamePaused`, `activePanel`, `graphicsQuality`,
`musicVolume`, `soundEffectsVolume`, and `playerPreferences`. Only quality,
volumes, and player preferences persist under `riyan-village-settings`.
Hydration occurs after mount to avoid server/client markup mismatch. Saved
values are validated. Game/panel state resets when leaving the world. Settings
pause scene controls. Audio values are saved preferences only: audio is not
implemented in this phase.

The native dialog handles modal focus containment and Escape; focus returns to
the trigger. UI respects both OS reduced motion and the saved preference.
Use keyboard HTML navigation or Quick Portfolio whenever 3D controls are unsuitable.

## Dependency compatibility

Runtime versions are pinned: Next 16.4.2, React/React DOM 19.3.1, Three 0.186.1,
Fiber 9.8.2, Drei 10.7.9, Rapier 2.2.0, Zustand 5.0.15. Tailwind/PostCSS plugin
are 4.3.3. These versions were checked against npm peer dependency metadata;
Fiber 9, Drei 10, and Rapier 2 support React 19. Rapier is now initialized locally
on `/world`. The core `@dimforge/rapier3d-compat` 0.19.2 is declared directly to
match the wrapper's exact runtime and support the controller/tests. tsx 4.23.15 is
development-only and runs the TypeScript tests.
No external fonts, media, paid services, or databases are required.

The npm scripts explicitly use Next.js's supported Webpack bundler. Turbopack
failed to connect to its CSS worker on the development host, including outside
the sandbox; Webpack compiled and built successfully. This remains compatible
with Vercel's Next.js preset.

ESLint 9.39.5 is retained because Next's bundled React/import/accessibility
plugins do not yet accept ESLint 10. npm marks ESLint 9 as unsupported. The
full audit reports five related high-severity development-only findings from
`braces` through the Next lint configuration; the available latest braces
release is affected. Do not force npm's suggested downgrade to Next 14's lint
configuration. The production-only audit reports zero vulnerabilities. Recheck
this tooling chain when compatible patched releases become available.

## Content and assets

Edit `src/data/portfolio.ts` with approved real information. Do not invent
projects, work history, credentials, contact links, or accomplishments.
The menu map is a concept illustration, not a functioning navigation map. All
world structures and vegetation are original procedural geometry, not claimed
GLB downloads. No external asset references or license-dependent downloads are
required. The procedural builders provide the coherent fallback and replacement
boundary for future verified assets.
See `public/assets/README.md` for the future model replacement and license policy.

## Planned phases

Phases 01–03 are implemented. Later phases remain subject to explicit scope:

1. Foundation: project setup, menu, settings, routing, HTML fallback, scene test.
2. Medieval world: finite terrain, five landmarks, square, roads, scenery, and
   configuration/obstacle preparation.
3. Exploration: civilian model, animation, movement, follow camera, collisions,
   input lifecycle, and development diagnostics.
4. Interactions: NPCs, dialogue, buildings, and objects.
5. Portfolio integration: guild projects, blacksmith skills, library experience
   and education, gate contact, using approved real content.
6. Optional discovery quests, accessibility polish, performance, deployment QA.

## Vercel

Use the standard Next.js preset and project root. Build with `npm run build`;
let Vercel detect the output directory. No environment variables or backend
services are required. Use a supported Node version meeting the engine floor.
Settings are browser-local, not synchronized between devices. Do not enable
static export without separately checking route and asset requirements.

Next.js appended its standard managed guidance block to `AGENTS.md` on the
first dev run; the existing project instructions are preserved above it.

## Manual verification

1. Open `/` at desktop and 375px mobile widths; check layout and horizontal overflow.
2. Use Tab/Shift+Tab and Enter for menu navigation. Open Settings, change quality
   and volumes, toggle reduced motion, press Escape, and check restored focus.
3. Reload and check saved preferences. Verify a new world session is not paused.
4. Enter `/world`, focus the canvas, and walk with WASD/arrows. Hold Shift to run;
   turn with a different direction and try a diagonal. Drag and adjust distance.
   Approach walls and trunks, traverse the gate, and release keys to stop. Press
   E to wave, then Escape to pause and hold W: position must remain fixed. Open
   Settings and use a volume slider's arrow keys: the resident must stay still.
   Return focus to the canvas to continue. Development Debug can show values
   and colliders. On small screens test direction holds, Run, and +/− controls.
   Change graphics quality and follow directory links without losing navigation.
5. Visit `/portfolio` directly with WebGL unavailable and with JavaScript disabled;
   confirm section links and all content remain accessible.
6. Emulate reduced motion; check the loading indicator no longer animates.
7. Check browser console for unexpected errors and run npm test, lint, typecheck,
   and build. See docs/phase-03-verification.md for tested scope and limitations.
