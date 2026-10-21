# The Village of Riyan

A medieval personal portfolio built with Next.js App Router, React, TypeScript,
Tailwind CSS, and React Three Fiber. Phases 01–08 provide the foundation,
procedural village, playable civilian, interactive buildings, five villagers,
real portfolio content imported from https://heyriyan.vercel.app/, and optional
exploration discoveries with a saved journal and village map, and a shared
parchment/wood interface design system. Phase 08.5 makes the village an immersive,
viewport-filling experience with floating controls and in-world overlays. Missing personal
details remain explicit TODOs.

Phase 08.6 refines that world interface with a quieter action cluster, compact
location/objective hierarchy, small discovery markers, consistent surface tokens,
clearer panel typography, and lighter dialogue choices. Existing mechanics and
portfolio content continue to drive the experience.

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
npm run test:interactions # Range, real wall occlusion, destinations, pause, and cooldown
npm run test:dialogue # Dialogue graph/actions, NPC placement/occlusion, handoffs, camera
npm run test:portfolio # Real content, source/asset integrity, safe links, shared HTML rendering
npm run test:exploration # Quest events, persistence, lifecycle, journal, and world map
npm run test:ui    # Shell/HUD, shared scroll lock, modal lifecycle, settings, contrast, fonts
npm test           # All seven suites
npm run build      # Production build
npm run test:portfolio:build # After build: distinct world shell and script-free portfolio HTML
npm start          # Serve the production build
```

## Routes

- `/`: responsive main menu, original illustrated concept map, and settings.
- `/world`: viewport-filling client-only WebGL2 village with floating HUD controls,
  five landmarks, a furnished square, connected roads, and woodland boundaries.
  Click/focus the scene, then WASD/arrows to walk, Shift to run, E to talk to
  a nearby villager or interact at an entrance, Escape to close a panel or pause.
  Drag to rotate the third-person camera. Scroll or use +/− for distance.
  Small screens offer directional buttons, a Run toggle, and tappable prompts.
  Journal, Map, Settings, and Menu float at the top-right; location and optional
  walking guidance sit at the top-left. Controls holds Wave, camera-distance
  buttons, and Pause. Quick Portfolio is available from Settings/Pause and
  loading/error/no-JavaScript fallbacks. No document sections surround the scene.
- `/portfolio`: server-rendered HTML portfolio with section navigation;
  independent of WebGL and readable with JavaScript disabled. Includes profile,
  five projects, skills, three work records, education, five certifications, and
  public contact channels, using the exact data shared by the village.
- `/portfolio/projects/[projectId]`: five static case-study routes with source
  screenshots, challenge/contribution/outcome records, and explicit TODO gaps.

## Architecture

```text
src/app/                 App Router pages, global styling, route loading UI
src/app/styles/          Shared tokens, base typography, controls, menu, and world HUD
src/app/world/           Immersive route layout/loading and world-only overlay styles
src/components/ui/       Button, Panel, Modal, LoadingIndicator, SectionHeading,
                         MedievalInterface
src/components/menu/     Original SVG concept illustration
src/components/world/    Viewport shell, client loader, canvas, scene composition
src/components/world/hud/ Floating status/actions and the native pause overlay
src/components/world/player/ Articulated civilian, controller, follow camera, HUD
src/components/world/physics/ Static Rapier colliders
src/components/world/interactions/ Physics query bridge, prompt, location, panels
src/components/world/npcs/ Shared procedural resources, costumes, animated villagers
src/components/world/dialogue/ Parchment conversation UI, text reveal, vector portraits
src/components/world/exploration/ Optional quest journal, overview map, shared overlay
src/components/portfolio/ Shared journal, project board/case studies, skills, archives,
                          contact resources, safe optional images
src/data/                Typed portfolio content and centralized world layout
src/data/portfolio/      Profile, contact, projects, skills, experience, education,
                         certificates, source references, and missing-content index
src/hooks/               Browser capability hooks
src/stores/              Zustand state, saved preferences, and saved exploration
src/systems/world/       Deterministic static geometry builders, placement,
                         shared terrain mesh data, roads, and collision data
src/systems/player/      Mutable simulation, input lifecycle, character controller,
                         camera obstruction queries
src/systems/interactions/ Nearest-entrance selection, visibility query, interaction manager
src/systems/dialogue/    Pure branching engine and graph validation
src/systems/exploration/ Quest event matching, progress validation, map transforms,
                         journal/map panel lifecycle
src/systems/portfolio/   Verified outbound-link eligibility
src/systems/ui/          Shared route/dialog scroll locks and focus restoration
src/systems/             Graphics presets and persistence adapter
src/types/               Shared content and state contracts
public/assets/           Optional assets and license/replacement documentation
public/assets/fonts/     Local WOFF2 fonts, sources, hashes, and OFL license notices
tests/                   World, player/physics, interactions, dialogue, portfolio,
                         exploration, interface, and post-build HTML checks
```

The canvas is loaded with `ssr: false` from a client component and only on
`/world`. Active gameplay renders continuously. Manual, Settings, building, journal, and map
pause use on-demand rendering. Conversations keep visual frames running for NPC
gestures and camera framing, while physics/player movement remain paused.
Pixel ratio and shadows follow quality.
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
props. Terrain uses one vertex-colored geometry. Landmark labels live in an
HTML overlay; one reused vector projects five positions. The Map and HTML
portfolio offer direct landmark/section access. Mobile labels use map numbers.

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
use articulated groups. The Wave button remains a standalone friendly gesture;
E is reserved for nearby building interactions. A future compatible rigged GLB should replace only this
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

Development builds expose diagnostics through Settings → Developer tools. Position,
state, speed, heading, ground contact, obstruction, and camera values update at
4 Hz directly through an output ref. Optional collider wireframes share that
explicit toggle. Debug state is session-only, resets on world exit, and has no
standard HUD control or production-facing UI.

Zustand holds `gameStarted`, `gamePaused`, `activePanel`, `graphicsQuality`,
`musicVolume`, `soundEffectsVolume`, `cameraSensitivity`, and `playerPreferences`.
Only quality, volumes, camera sensitivity, and player preferences persist under
`riyan-village-settings`.
Hydration occurs after mount to avoid server/client markup mismatch. Saved
values are validated. Game/panel state resets when leaving the world. Settings
pause scene controls. Audio values are saved preferences only: audio is not
implemented in this phase.

The native dialog handles modal focus containment and Escape. Focus returns to
its usable opening control; when a conversation/entrance prompt has disappeared,
the scene is the fallback. Hidden or disabled controls are never restored.
UI respects both OS reduced motion and the saved preference.
Use keyboard HTML navigation or Quick Portfolio whenever 3D controls are unsuitable.

## Interactive buildings

Approach the small brass-colored ground marker at a building entrance. The
wooden signs identify its name and purpose. A nearby prompt reads “Press E to
interact” and also works as a button for keyboard/touch users. There is no E
action from across the village. The location label changes as you enter a district.

`src/data/world.ts` remains the coordinate/anchor/section source.
`src/data/building-interactions.ts` maps stable IDs to presentation and defines
interaction tuning. The centralized manager checks all five anchors, selects
the nearest within its two-unit radius, checks height and the facade side, and
casts a Rapier ray from the resident toward the anchor. Solid obstacles block
interaction; sensors and the resident's own body are excluded. E and prompt
clicks use the same request path and revalidate geometry on the next frame.

Cottage maps to About Me; Guild to Projects; Forge to Skills; Library to
Experience, Education, and Certifications; Gate to Contact. The HTML panels use
the same typed local content as `/portfolio`, including explicit TODO states.
No biography, achievements, projects, credentials, or contact links are invented.

Opening sets the shared blocking panel and pauses physics/camera. The canvas,
resident, position, and camera remain mounted. Native dialog focus containment,
Escape/Close/Return controls, a short fade, and a 350 ms reopening guard manage
the transition. Closing restores scene focus and clears old input; press a fresh
movement key to continue. Reduced motion skips the fade. A separate transient
Zustand store publishes only target/location/panel changes; it is not persisted
and resets on world exit or context loss. The visibility ray and sign geometry
are reused. Five original canvas-painted sign textures require no external assets.

These building destinations open overlays without full 3D interiors or automatic
travel. All destinations remain available in the conventional `/portfolio` mode.

## Villagers and dialogue

Elder Alden welcomes visitors beside the well. Elara keeps the guild approach,
Borin stands by the forge, Lyra tends the library approach, and Rowan waits on
the inner gate road. Their cloak/staff, guild attire/ledger, apron/hammer,
books/glasses, and cap/keys distinguish them. All five use original procedural
models and vector portraits, with no external model, texture, or font download.

`src/data/npcs.ts` holds stable IDs, names, roles, derived building-relative
positions, rotations, appearance references, idle/talk/turn/wave tuning,
dialogue tree IDs, ranges, and destinations. Square placement is explicit there.
Static capsules prevent walking through villagers. NPCs turn toward the resident
nearby and during conversation. Animation uses shared resources and mutable
group refs; motion preferences disable decorative breathing/gestures.

The central interaction manager compares the nearest visible NPC with the
nearest visible entrance. The closest wins, with building priority on exact ties.
The prompt shows the NPC name and “Press E to Talk,” or the building action.
Range, floor, wall, focus, pause, and cooldown rules apply to both. Talk rays
exclude only the addressed NPC and resident, so other villagers still occlude.

`src/data/dialogues.ts` contains the authored dialogue trees. Nodes have stable
IDs, speaker, concise text, optional expression, choices, next node, and action.
The pure engine in `src/systems/dialogue/engine.ts` supports opening a portfolio
panel, highlighting a destination, completing an objective, closing, and branching.
Automatic branches have cycle/step guards. Invalid nodes fail safely, and the UI
always provides an independent Close/Escape exit. Validation checks references,
speakers, choices, destinations, objectives, automatic cycles, and exit paths.
Manual “another question” loops are intentional and always escapable.

The native parchment dialog has distinct portraits, choices, Continue, Close,
and optional typewriter text. Show all text skips revealing; choices can be
selected immediately. Tab/Shift+Tab and Enter/Space operate native buttons.
Screen readers receive the complete node text instead of character announcements.
OS/saved reduced motion shows text instantly and leaves the camera still.

Normal conversations smoothly reframe the pair from the closer side, with at
most a 90-degree desired orbit change. Existing sphere sweeps still protect walls;
the addressed NPC is excluded from these sweeps so close talks do not collapse
the camera into the pair. Closing restores canvas focus and smooth follow;
original player coordinates and orbit preferences remain intact. A portfolio
action transfers directly to the existing building dialog without unpausing.

Directions mark the destination label and entrance ring, and show its name in a
small guidance card. Alden supplies readable walking instructions. There is no
teleport. `src/stores/guidance-store.ts` holds the manual walking destination.
Discovery progress now lives in the separate persisted
quest store described below. Dialogue and manual directions reset on world exit/
context loss; completed discoveries and the tracked objective remain saved.

Rowan opens the shared contact panel with the email and GitHub/LinkedIn/Instagram
links published on the original portfolio. No resume was supplied, so no download
button is shown. A real approved CV file or URL must be provided before linking it.
NPC writing now reflects the imported records. The guild's entrance/NPC opens a
functional parchment quest board; choosing a notice opens a case study inside
the existing panel, and Back returns to the board without unmounting the scene.

## Real portfolio content

`src/data/portfolio.ts` is the shared facade over strongly typed local modules
in `src/data/portfolio/`. Source references and the 21 October 2026 review date
travel with the records. Update the modules once to change both portfolio modes.
There is no source-site/API dependency at runtime or build time.

The imported identity is Riyandi Heri Pitono (Riyan), an Information Technology
student at Telkom University and web developer. The original five project titles
are preserved: Mount Adventure Roblox, Car Evaluation Classifier, Cybersecurity
Learning Platform, IoT Monitoring Dashboard, and Chibii Snack Website. Published
work roles, education, and original-language certificate titles/issuers are kept.
Skills are grouped technically, without percentages; exploring items are marked.

`PortfolioSectionContent` and the shared renderers produce the Cottage journal,
Forge workshop, Library timelines/records, and Gate contact resources, as well
as conventional HTML sections. The Guild adds local selection state around the
same project board/case-study renderer. Its records are also direct, static HTML
routes, with titles/descriptions, semantic headings, and crawlable project/contact
links. Unknown project IDs return 404. No deployment hostname or canonical URL
was invented for this new application.

Four real source project captures and one portrait are stored under
`public/assets/portfolio/`. Next Image serves responsive versions; failed optional
images expose a text fallback and never hide the written record. The IoT source
uses stock imagery, so its gallery instead asks for a genuine screenshot.

The original project actions are `#` placeholders, so demo/repository actions
are omitted. No credential links or CV were supplied. The classifier's reported
accuracy is qualified as source-reported with missing evaluation context.
Roblox naming and Chibii implementation/stack conflicts are disclosed instead
of silently guessing. LinkedIn is verified as a published owner link but blocks
automated availability checks. Public email uses a real mailto link; the source
site's third-party form submission service is not included.

See `docs/portfolio-source-audit.md` for sources/media permission/checks and
`docs/portfolio-missing-content.md` for the complete manual completion list.
`missing-content.ts` exposes the structured TODO index. Preserve nulls and TODOs
until actual information is supplied. Resume, demo, repository, and credential
actions require safe, sourced destinations; missing values never become buttons.

## Optional exploration journal and map

Phase 07 introduced Journal and Map, now floating at the top-right. These keyboard/
touch controls open a parchment dialog that pauses the resident and physics.
Discoveries and Village map switch pages inside the same dialog. Escape or Close
returns focus to the usable opener (or the scene fallback) and preserves any
explicit manual pause.

`src/data/quests.ts` is the typed catalog. `src/systems/exploration/progress.ts`
matches successful game events to objectives and derives Not started, Active,
and Completed records. The initial suggestion is Elder Alden; visitors can stop
tracking, select another objective, or complete any objective without selecting it.
Tracking and opening the journal/map never give progress. There are no rewards,
levels, content gates, or required quest order.

| Objective | Actual completion trigger |
| --- | --- |
| The First Encounter | Successfully start a conversation with Elder Alden. |
| The Guild’s Records | Open the Guild project panel through its entrance or Elara. |
| Tools of the Trade | Successfully start a conversation with Borin. |
| Pages of the Past | Successfully start a conversation with Lyra. |
| A Message Beyond | Successfully start a conversation with Rowan. |

The existing interaction manager still checks proximity, focus, line of sight,
blocking dialogs, and cooldown before these successful actions emit events.
Completion is idempotent. Alden’s dialogue objective hook now uses the same
catalog/store instead of maintaining a second completion array. After all five,
the HUD and journal quietly display “Every story in the village has been
discovered.” Free exploration continues. Every portfolio panel and HTML route
remains accessible before and after every discovery.

`src/stores/quest-store.ts` persists only completed IDs and the selected objective
under `riyan-village-exploration-v1`, schema version 1. Counts, percentages, and
statuses are derived from those saved IDs to avoid contradictory saved progress.
Hydration occurs on the client before starting interactions. Unknown/duplicate
IDs and invalid selections are filtered; incompatible versions start a fresh
optional journal. Malformed JSON, unavailable storage, and exhausted quota leave
the in-memory journal usable. Runtime coordinates, pauses, dialogs, NPC sessions,
and manual directions are never persisted with exploration progress.

The map is an SVG/HTML interface outside the Three renderer. Its finite boundary,
square, well, roads, rotated building footprints, entrance targets, and NPC
objective markers use existing world/NPC configuration. North is world -Z;
east is +X. Numbers match the scene landmarks. Blue marks the resident, a gold
diamond marks the tracked objective, and gold outlines mark a walking destination.
The resident’s position/heading are captured when the paused map opens, without
per-frame React updates. Text labels and an HTML destination list accompany the
map; Mark path highlights the existing landmark and returns to walking. It does
not teleport or complete a quest. Saved tracking restores the subtle destination
card and building marker on the next visit. Manual directions take precedence;
Clear directions stops tracking and clears the manual mark.

The journal/map components live in `src/components/world/exploration/`, with
separate quest contracts, state, map math, panel lifecycle, and responsive styles.
No additional assets, packages, APIs, or environment variables were introduced.
Run `npm run test:exploration` for the focused checks and see
`docs/phase-07-verification.md` for scope, verification, and manual checks.

## Interface design system

Phase 08 uses one parchment, walnut, forest, stone, and antique-gold palette.
`src/app/styles/tokens.css` owns the colors, typography, spacing scales, and
transition durations; base, components, menu, and world styles are split into
small files. Portfolio and exploration styles use these same tokens. Darker
gold is used for text, while lighter antique gold is used for ornamentation.
Text contrast pairs are tested at 4.5:1; focus has a blue outline and a light
halo so hover/wood backgrounds cannot hide it. This is not a full WCAG audit.

Cinzel 600 titles and Source Sans 3 body/control text are self-hosted through
`next/font/local`, with system fallbacks. Journal prose uses system Georgia.
Font source URLs, intact licenses, and SHA-256 hashes are recorded in
`public/assets/fonts/README.md`. No external font calls are required.

Phase 08.5 replaces the earlier reserved toolbar with floating overlays. The
world shell occupies the viewport with `100dvh`, safe-area insets, and no page
scroll. The canvas is the base layer; a pointer-transparent HUD occupies the
next layer; native dialogs appear in the browser top layer. Clear removes
tracking and a route summary opens the existing map. Touch controls, prompts,
and hints reserve separate positions in the HUD.

Shared native dialogs keep their close button in a sticky header, lock document
scroll while open, and focus their title. Deferred focus restoration does not
steal focus during dialogue-to-portfolio handoffs. Escape uses the native modal
cancel event; gameplay input also ignores native dialogs and details summaries.
Text reveal reserves the complete paragraph's height and keeps its skip control
in place. Choices remain usable during the reveal. OS and saved reduced-motion
preferences suppress transitions, the menu's brief settling animation, and text
reveal. Building/dialogue close transitions retain the existing 180ms lifecycle.

Camera sensitivity is a working 0.4×–2.0× multiplier on drag input. It is saved
with validated settings; existing version-1 settings without it default to 1×.
Music/SFX remain explicitly labelled future-audio preferences. No audio files
or fictional resume/download links were added. Real portfolio content and all
quest, physics, NPC, and movement mechanics are preserved.

Overlay panels use thin bronze borders, warm ivory surfaces, restrained forest
accents, and soft shadows. The world stays visible around them through a light
scrim. Conversations dock near the bottom with a small portrait, NPC identity,
text, and concise choices. Skills, archive and project records use lighter
framing within the same shared `Modal` presentation. Long records scroll inside
the overlay while the close control stays reachable.

Controls holds the detailed instructions, Wave, camera-distance actions, and
Pause. Escape closes Controls before pausing the village. The pause overlay
offers Resume, Settings, Quick Portfolio, and Main menu. Settings opened during
a manual pause returns to that pause, rather than resuming exploration.
The shell and native dialogs share a reference-counted document scroll lock,
so closing an overlay cannot unlock the world; leaving the route restores
normal scrolling for `/portfolio` even if a dialog unmounts during navigation.

Phase 08.6 unifies the world surfaces with shared border, radius, shadow, and
type-scale tokens. Top-right actions share a compact parchment cluster. Location
and objective labels are subordinate to the current place, with five quiet
discovery marks accompanying the real progress count. Contextual prompts fit
their content and rise above corner controls at intermediate widths. Thin
dividers, consistent 44px control targets, aligned panel padding, and a 66ch
prose measure improve longer records. Dialogue choices omit decorative reply
numbers and give portfolio-opening actions a restrained forest accent.
No filters, renderer effects, font downloads, or new animation loops were added.

The subsequent UI audit removes repeated headings/introductory copy from
single-section building panels, corrects nested Library heading levels, protects
HUD opener focus, and focuses new dialogue turns after a choice. Controls stays
above touch Run; loading links no longer overlap centered loading content.
Short-screen rules retain guidance when space permits and do not force narrow
dialogue choices into two columns. See `docs/ui-audit-08.5-08.6.md` for findings,
regression coverage, and the manual review checklist.

This fills the browser viewport; it does not require the browser Fullscreen API
or hide the browser's own chrome. Responsive and native keyboard behavior still
require live browser checks. See `docs/phase-08.6-verification.md` for the latest
visual polish, tests, limitations, and manual acceptance checklist, and
`docs/phase-08.5-verification.md` for the fullscreen architecture/file inventory.
The earlier Phase 08 report documents the previous UI baseline.

## Dependency compatibility

Runtime versions are pinned: Next 16.4.2, React/React DOM 19.3.1, Three 0.186.1,
Fiber 9.8.2, Drei 10.7.9, Rapier 2.2.0, Zustand 5.0.15. Tailwind/PostCSS plugin
are 4.3.3. These versions were checked against npm peer dependency metadata;
Fiber 9, Drei 10, and Rapier 2 support React 19. Rapier is now initialized locally
on `/world`. The core `@dimforge/rapier3d-compat` 0.19.2 is declared directly to
match the wrapper's exact runtime and support the controller/tests. tsx 4.23.15 is
development-only and runs the TypeScript tests.
Fonts and approved portfolio media are bundled locally. No remote font service,
paid service, or database is required.

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
GLB downloads. No remote asset requests are needed at runtime. Font licenses and
portfolio image provenance accompany the local assets. The procedural builders
provide the coherent fallback and replacement
boundary for future verified assets.
See `public/assets/README.md` for the future model replacement and license policy.

## Planned phases

Phases 01–08 and the 08.5 fullscreen UI refactor are implemented, with browser acceptance checks noted in the phase
reports. Later phases remain subject to explicit scope:

1. Foundation: project setup, menu, settings, routing, HTML fallback, scene test.
2. Medieval world: finite terrain, five landmarks, square, roads, scenery, and
   configuration/obstacle preparation.
3. Exploration: civilian model, animation, movement, follow camera, collisions,
   input lifecycle, and development diagnostics.
4. Interactive buildings: entrance proximity/visibility, signs, locations,
   shared portfolio panels, and safe return to exploration.
5. NPCs/dialogue: five distinct villagers, branching authored conversations,
   portfolio handoffs, walking guidance, and objective action hooks.
6. Real portfolio integration: shared typed content, actual projects and archives,
   Guild case studies, HTML project routes, public contact, and honest TODOs.
7. Exploration quests and journal: optional discoveries, event-driven progress,
   persisted tracking, a world-derived overview map, and walking guidance.
8. Premium medieval UI: shared tokens, local typography, responsive parchment
   panels, minimal HUD, readable portfolio records, and accessible settings.
   Phase 08.5: immersive viewport shell, floating HUD, compact dialogue, and shared
   world overlays with separate conventional portfolio access.
   Phase 08.6: quieter HUD clusters, consistent surfaces, typography rhythm,
   readable content overlays, and refined dialogue choices.
9. Further features, performance work, and deployment QA only when requested.

## Vercel

Use the standard Next.js preset and project root. Build with `npm run build`;
let Vercel detect the output directory. No environment variables or backend
services are required. Use a supported Node version meeting the engine floor.
Settings and exploration progress are browser-local, not synchronized between
devices. No gameplay feature requires storage access. Do not enable
static export without separately checking route and asset requirements.

Next.js appended its standard managed guidance block to `AGENTS.md` on the
first dev run; the existing project instructions are preserved above it.

## Manual verification

1. Open `/` at desktop and 375px mobile widths; check layout and horizontal overflow.
2. Use Tab/Shift+Tab and Enter for menu navigation. Open Settings, change quality
   and volumes, drag camera sensitivity, toggle reduced motion, press Escape,
   and check restored focus. Compare camera drag at 0.4× and 2.0× in the scene.
3. Reload and check saved preferences. Verify a new world session is not paused.
4. Enter `/world`, focus the canvas, and walk with WASD/arrows. Hold Shift to run;
   turn with a different direction and try a diagonal. Drag and adjust distance.
   Approach walls and trunks, traverse the gate, and release keys to stop. Press
   Wave under Controls, then Escape to pause and hold W: position must remain fixed. Open
   Settings and use a volume slider's arrow keys: the resident must stay still.
   Return focus to the canvas to continue. Settings → Developer tools can show values
   and colliders. On small screens test direction holds, Run, and +/− controls.
   Change graphics quality; use Map destinations or Quick Portfolio from Settings.
5. Visit all five entrance markers. Check nearby prompts, E and prompt-click
   opening, correct sections, Escape/Return, restored scene focus, and unchanged
   position. Walk away: the prompt must disappear. Try E far from all targets,
   behind a building, and while Settings is open: no destination should open.
   Hold E and close a panel: it must not immediately reopen. Repeat at mobile
   width and with reduced motion enabled.
6. Talk to all five villagers. Try Alden’s controls/Continue, destination choices,
   and optional stroll; check guidance without teleporting. Use each keeper's
   Open action and check the matching building panel. End conversations using
   Escape/Close, then press a fresh movement key. Verify no E-repeat reopening.
   Test Tab/Shift+Tab, Enter/Space, Show all text, the reveal preference, and
   reduced motion. Rowan should show the published contact/social channels and a
   clear resume TODO, with no fake CV download.
7. Visit `/portfolio` directly with WebGL unavailable and with JavaScript disabled;
   confirm all seven section links and content remain accessible. Open each
   project case study directly. In the Guild, select each notice, inspect its
   gallery/records/TODOs, and return to the board and exploration. Check the real
   mailto action, public social links, and omission of unverified project actions.
8. Open Journal and Map with keyboard and touch at desktop and 375px width.
   Track/stop tracking objectives, inspect the player/target/landmark markers,
   and mark a walking destination. Check that dialogs pause movement, map
   selection never teleports/completes a quest, and Close/Escape restores focus.
   With Debug visible, compare map position to world X/Z at each landmark.
   Talk to Alden, Borin, Lyra, and Rowan; open the Guild board through its entrance
   or Elara. Complete in any order, including untracked objectives. Check 5/5
   and the completion message; continue walking and opening portfolio panels.
   Refresh mid-progress and after completion; verify saved tracking/progress.
   With site storage disabled, repeat an interaction and check the in-memory
   journal still updates. Content must remain available at zero discoveries.
9. Emulate reduced motion; check the loading indicator no longer animates.
10. Check browser console for unexpected errors and run npm test, lint, typecheck,
   and build sequentially, then `npm run test:portfolio:build`. See
   docs/phase-08.6-verification.md for tested scope and limitations. Browser origin
   approval previously declined localhost; no workaround browser pass is claimed.
