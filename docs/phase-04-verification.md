# Phase 04 — Interactive buildings

Implemented on 18 October 2026 in `D:\THEVILLAGE`.

## Delivered scope

All five building IDs now resolve to an entrance interaction and a themed HTML
information panel: Cottage/About Me, Guild/Projects, Forge/Skills, Library/
Experience/Education/Certifications, and Gate/Contact. Personal content remains
explicitly unavailable until approved information is supplied. No NPC dialogue,
quests, full interiors, invented credentials, or external asset references were added.

## Modified files

- `src/types/interaction.ts`, `src/data/building-interactions.ts`: typed
  interactable/presentation contracts and shared tuning; coordinates and section
  associations continue to come from the existing world configuration.
- `src/systems/interactions/selection.ts`, `visibility.ts`, `manager.ts`: nearest
  valid entrance, distance/height/facade guards, reusable Rapier visibility ray,
  centralized request consumption and fresh target revalidation.
- `src/stores/interaction-store.ts`: transient target, district, active building,
  open/closing lifecycle, cooldown, and teardown; no LocalStorage persistence.
- `src/components/world/interactions/interaction-manager.tsx`: physics/frame
  bridge. `proximity-prompt.tsx`, `location-notification.tsx`, and
  `building-panel-manager.tsx`: separate HTML prompts, district announcements,
  native modal panels, content mapping, close timing, and HTML portfolio links.
- `src/components/world/environment/building-signs.tsx`: original painted wooden
  signs and restrained entrance rings, with shared/disposed rendering resources.
- `src/components/world/village-scene.tsx`, `world-canvas.tsx`: interaction and
  sign composition, focus restoration, and session cleanup. The scene remains
  mounted while panels are displayed.
- `src/components/ui/modal.tsx`: configurable close label, class, and optional
  after-close focus callback, retaining Settings behavior.
- `src/types/game.ts`, `player.ts`, `world.ts`, `portfolio.ts`: building panel,
  interaction request, certification section, and typed content ID contracts.
- `src/systems/player/input.ts`, `motion.ts`,
  `src/components/world/player/player-hud.tsx`: E requests building interaction;
  keyboard repeat/focus/menu guards remain active; Wave stays a separate button.
- `src/data/world.ts`, `portfolio.ts`: Cottage HTML anchor and Library section
  associations; explicit About Me and Certifications empty states, also rendered
  automatically by the independent HTML portfolio.
- `src/app/world/page.tsx`, `globals.css`: current instructions, responsive
  interaction UI, parchment panel transitions, and reduced-motion behavior.
- `tests/interactions.test.ts`, `tests/player.test.ts`, `package.json`: dedicated
  interaction suite and updated keyboard lifecycle coverage/scripts.
- `README.md`, `public/assets/README.md`, this document: architecture, controls,
  asset provenance/replacement, test instructions, and verification limits.

## Decisions

The two-unit entrance range is measured horizontally at the resident's feet,
with a separate height limit. A facade-side guard and a physics ray prevent
interactions through walls or from another floor. All solid colliders participate;
the player's body and sensors are excluded. The nearest *visible* candidate wins,
so an obscured closer candidate does not hide a reachable alternative. Both E
and prompt activation pass through the same manager and recheck position/occlusion.

Opening a building uses the existing blocking pause contract. Physics and camera
stop without unmounting the canvas or changing the resident's coordinates.
The native dialog provides focus containment and Escape handling. Closing keeps
controls blocked through a 180 ms fade, restores canvas focus, and adds a 350 ms
reopening guard. OS/saved reduced motion skips the fade. Old held input is cleared;
exploration resumes with a fresh movement key. Explicit manual pause remains intact.

Frame math reuses a ray and reads the mutable player runtime. Zustand only
publishes changes in target/location/panel; stationary frames do not publish
redundant updates. Signs share geometry and wood/marker materials. Five original
768 × 256 canvas textures use installed system serif text and require no downloads.
Panels and `/portfolio` consume the same local content, with working section links.

## Dependencies

None installed or upgraded. Existing Next/React/Three/Fiber/Rapier/Zustand
versions and the lockfile are unchanged. Only a test script was added.

## Verification

| Check | Result |
| --- | --- |
| `npm test` | Passed: 23 tests (4 world, 11 player, 8 interaction) |
| `npm run lint` | Passed without warnings |
| `npm run typecheck` | Passed when run sequentially |
| `npm run build` | Passed; `/`, `/world`, `/portfolio` prerendered |
| `npm run dev` | Started successfully on port 3000 |
| Browser interaction/visual pass | Not run: browser origin approval declined |

The interaction tests cover all five ID/section mappings and entrance ranges,
out-of-range/height rejection, overlapping nearest-visible selection, actual
village collider visibility, player self-exclusion, a real solid wall versus a
sensor inside interaction range, stale-target rejection, focus/blocking-menu
guards, each destination's open/close/pause/cooldown, coordinate preservation,
manual pause preservation, and zero redundant stationary-frame store updates.
The input harness checks E repeat rejection and form/Settings guards.

## Errors and limits

- The initial lint pass caught a React Compiler memoization dependency mismatch
  in the visibility callback. It was corrected by memoizing only the reusable
  ray. The subsequent lint pass succeeded.
- An initial typecheck overlapped the build's generated-type cleanup and reported
  transient TS6053 missing `.next/types` files. Running it after the build passed.
  Run build and typecheck sequentially because they share generated files.
- Existing nonfatal Rapier initialization and Three CJS deprecation warnings
  occur in Node physics tests. They have not been suppressed. No dependencies
  were changed to address unrelated tooling warnings.
- The browser approval gate declined access to the local development site.
  No alternate browser/origin or indirect browser execution was used. Therefore
  sign readability, fade appearance, real native-dialog focus restoration,
  browser console state, desktop end-to-end stability, mobile touch behavior,
  and screen-reader announcements are **not browser-verified in this phase**.
- Colliders approximate structural solids. Thin sign posts, painted plaques,
  and some foliage remain visual decorations. The physics visibility check
  reflects solid colliders rather than every rendered triangle.
- No production browser pass, low-end GPU benchmark, device audit, or Vercel
  deployment was performed. The independent HTML portfolio is prerendered by
  the build, but JavaScript-disabled browsing was not repeated here.

## Manual testing

1. Run `npm run dev`, open `/world`, focus the scene, and walk from the well.
   Press E in the square: no building panel should open.
2. Follow each road to its entrance ring. Confirm the wooden sign names the
   building, the district label changes, and the nearby prompt says “Press E
   to interact.” Back away beyond the ring's two-unit interaction radius; the
   prompt must disappear. Walk behind a building and try E there.
3. At every entrance, press E and check the destination and section headings:
   Cottage/About Me; Guild/Projects; Forge/Skills; Library/Experience, Education,
   Certifications; Gate/Contact. Every section should clearly await real content.
4. Enable development Debug before opening. Note position and camera values.
   Open a panel while moving: movement must stop. Try WASD and E in the panel.
   Close using Escape, Close, and Return on separate visits. Coordinates/camera
   should be preserved, the canvas should regain focus, and a fresh movement key
   should work without a scene reload. Hold E through closing: no immediate reopen.
5. Check Tab/Shift+Tab containment in the panel. Open Settings and use form keys:
   no interaction/movement should occur. Pause manually, open/close Settings,
   and confirm the manual pause is retained.
6. At 390px width, test the direction controls, Run, tappable proximity prompt,
   readable panel scrolling, and return. Enable OS or saved reduced motion and
   confirm panel/location animations are removed.
7. Use a panel's Quick Portfolio link and the HTML directory. Confirm the
   matching real section anchors, About Me and Certifications empty states,
   and independent `/portfolio` access with WebGL/JavaScript unavailable.
8. Inspect browser console for errors. Run `npm test`, `npm run lint`,
   `npm run typecheck`, and `npm run build` sequentially.

The requested implementation is present and automated checks pass. Range,
occlusion, destination mapping, pause/return state, and no-reload architecture
are covered by code/tests. Full Phase 04 acceptance remains pending the blocked
desktop browser pass; visual prompt/sign behavior and native-dialog return
controls are not claimed as end-to-end verified.
