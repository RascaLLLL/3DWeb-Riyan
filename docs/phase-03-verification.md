# Phase 03 — Player character and third-person camera

Verified on 18 October 2026 with Node 24.15.0 on Windows.

## Deliverable

A playable civilian now spawns near the square's water well. WASD/arrows move
relative to camera yaw, Shift runs, drag rotates the follow camera, scroll or
the distance buttons adjust zoom, E/Wave performs a friendly gesture, and
Escape/Pause stops the simulation. No quests or NPC dialogue were introduced.

## Modified files

- `src/types/player.ts`, `src/data/player.ts`: movement/animation/runtime
  contracts and capsule, motion, gravity, stepping, camera, and gesture tuning.
- `src/systems/player/motion.ts`: normalized camera-relative input, acceleration,
  deceleration, heading smoothing, state transitions, input reset, and runtime
  actions. Runtime changes do not trigger React/Zustand updates each frame.
- `src/systems/player/controller.ts`: Rapier character-controller configuration,
  fixed-step movement, gravity, grounded/blocked state, and recovery guard.
- `src/systems/player/input.ts`, `src/hooks/use-player-input.ts`: focused-canvas
  keyboard/pointer bindings, form/menu guards, blur/visibility handling, capture
  release, and complete listener/subscription cleanup.
- `src/systems/player/camera.ts`: player-excluding sphere sweep queries.
- `src/components/world/player/civilian-character.tsx`: original articulated
  tunic/belt/boots/satchel visual and idle/walk/run/turn/wave animation.
- `src/components/world/player/player-controller.tsx`: capsule/kinematic body,
  physics callbacks, character visual, and resource lifecycle.
- `src/components/world/player/third-person-camera.tsx`: smooth follow/orbit,
  pitch/distance limits, obstruction compression, and final-path safety sweep.
- `src/components/world/player/player-hud.tsx`: pause/resume, wave, distance,
  small-screen movement/run controls, and development-only diagnostics/wireframes.
- `src/systems/world/terrain-data.ts`, `src/components/world/environment/terrain.tsx`:
  shared terrain vertices for rendering and physics.
- `src/systems/world/collision-data.ts`, `src/components/world/physics/world-colliders.tsx`:
  fixed obstacles, terrain trimesh, smooth road/plaza slabs, roof hulls, and finite
  boundary. Existing building/tree/prop collision metadata is now active.
- `src/components/world/village-scene.tsx`, `world-canvas.tsx`: local Rapier
  initialization, fixed 60 Hz physics/interpolation, player/camera integration,
  active rendering, and paused demand rendering. Existing HTML/WebGL fallbacks
  and landmark labels remain separate from physics.
- Removed `src/components/world/development-camera.tsx`; the follow camera
  replaces the temporary environment inspection camera.
- `src/stores/game-store.ts`: explicit manual pause, blocking-panel composition,
  and preservation of manual pause when Settings closes. Runtime flags are not
  included in persisted settings.
- `src/data/world.ts`: well-adjacent spawn adjustment.
- `src/app/world/page.tsx`, `src/app/globals.css`: controls/instructions, HUD,
  responsive directional controls, debug styling, and current chapter copy.
- `tests/player.test.ts`, `package.json`, `package-lock.json`: real physics/math/
  input tests, test scripts, and compatible dependency declarations.
- `README.md`, `public/assets/README.md`: current architecture, controls,
  implementation phases, asset suitability decision, and GLB replacement contract.

## Implementation decisions

Rapier's position-based kinematic capsule uses a fixed 1/60 second timestep,
interpolation, explicit gravity, contact offset, slope limits, stepping, and
ground snap. Smooth slabs represent paths instead of hundreds of collider edges,
which avoids cobblestone jitter. Actual terrain vertices are shared with its
trimesh. Building/tree/prop obstacles and a finite perimeter prevent penetration
and leaving the terrain. A recovery guard handles invalid/out-of-bounds states.

The original articulated visual matches the requested civilian design and is
independent of the physical body. Kenney's licensed animated Mini Characters
pack was downloaded and inspected as a candidate, but its modern clothing was
not suitable for this character. It is not bundled. No GLB file is required or
invented. The replacement contract documents a real AnimationMixer adapter for
future compatible clips; this procedural character does not use a mixer.

Movement states are idle, walking, running, interacting, and paused. Turning is
a separate visual state/lean while heading follows input. Interacting is a
standalone wave gesture, not a simulated building/NPC interaction. Reduced motion
removes decorative bob; the camera has no step bob or shake.

The runtime, animation groups, camera vectors, and physics scratch values are
reused. Physics and frame callbacks do not write React or Zustand state. Debug
text updates directly at 4 Hz; ordinary UI state updates happen on user actions.
Input is bound only for the focused canvas and is cleared on menus, focus loss,
visibility changes, and teardown. A fresh key press is required after returning.

Camera sphere sweeps exclude the player's body, shorten the camera behind
obstacles, and check the final smoothed path. The avatar is hidden if compression
would otherwise place the camera inside it. This can become a close view in
tight spaces; collider geometry remains an approximation of some scenery.

## Dependencies

- Added development-only `tsx` **4.23.15** to execute TypeScript physics tests.
- Declared `@dimforge/rapier3d-compat` **0.19.2** directly, matching the exact core
  already used by installed `@react-three/rapier` **2.2.0**. No second Rapier
  version, framework upgrade, hosted service, or external API was introduced.

## Verification

| Check | Result |
| --- | --- |
| npm install | Passed |
| `npm test` | 15 passed: 4 world configuration + 11 player/physics/lifecycle |
| `npm run lint` | Passed without lint warnings |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; all three routes prerendered |
| `npm ls --depth=0` | Passed; compatible direct dependencies |
| `npm audit --omit=dev` | Zero production vulnerabilities |
| Development browser | Civilian, animation, walking, turn, run, wave, camera drag/zoom, obstruction, pause, and Settings exercised |
| Walking/running diagnostics | Approximately 3.10 / 5.5 m/s, grounded |
| Pause test | W held while paused; position remained 1.99, 1.08, -6.58 |
| Form guard | Settings slider arrow input did not move the resident |
| Mobile-width check | 390 × 844; no horizontal overflow; held directional control moved the resident |
| Debug controls | State/position/camera output and collision checkbox operated in development |
| Navigation | World → HTML portfolio → main menu navigation exercised without application console errors |
| Production server startup | Started successfully, then stopped after browser verification was blocked |

The real Rapier tests exercise stable ground support for fifteen seconds,
normalized diagonal speed, walking/running difference, blocking at each of four
building entrances, a large tree, traversable gate opening, finite perimeter,
pause/focus guards, camera obstruction/self-exclusion, and input listener cleanup.
The input harness also verifies menu/form guards, pitch limits, and capture
release. These checks are not a GPU/frame-rate benchmark or a full-device audit.

## Errors, limits, and unverified checks

- No application console errors were captured during the completed development
  browser checks. Nonfatal Three.Clock and Rapier initialization deprecation
  warnings remain. Node tests also warn about Three's CJS entry. These warnings
  are not suppressed. Installation still reports the previously documented five
  development-tool dependency findings; the production audit is clean.
- Browser approval for `http://127.0.0.1:3001` was declined by the browser's origin
  gate. The production browser pass, including direct confirmation of debug UI
  absence, was not executed. The build and server startup passed; production
  behavior is not claimed as browser-tested. No alternate production access was
  used. A later screenshot handoff encountered the old tab's blocked browser
  error page, so no final screenshot artifact was saved.
- Physical multitouch, a full screen-reader audit, all camera corners, and
  extended sessions on low-end devices were not tested. Small-screen controls
  were exercised with a held keyboard activation in the mobile viewport.
- Collider boxes are deliberately conservative. Building interiors are blocked;
  some thin decorations/foliage are visual only. Camera obstruction can produce
  close framing near walls/props. No claim of perfect mesh-level collision is made.
- The out-of-bounds recovery guard is present but was not separately fault-injected
  in the browser. Ground/perimeter behavior was tested with actual Rapier.
- Vercel deployment was not requested or performed. No optional GLB adapter is
  active, and no NPC dialogue or quest behavior is implemented.

## Manual testing

1. Run `npm run dev`, open `/world`, and click or Tab-focus the canvas.
2. Walk with WASD/arrows. Try diagonals, change direction, release keys to stop,
   then hold Shift to run. Inspect the resident's gait and heading.
3. Drag to look around, test pitch limits, and use scroll/+/- for distance.
   Back toward buildings and the well to inspect camera compression/recovery.
4. Follow paths to the landmarks. Push against walls and tree trunks, cross road
   edges, pass through the gate, and approach the outer ridge. The character
   should remain supported and stop at obstacles/boundaries.
5. Press E/Wave, then pause with Escape/Pause. Hold a movement key while paused.
   Resume, re-focus, and press a fresh key. Open Settings and operate sliders;
   the resident must remain stationary. Switch windows and return to check reset.
6. In development, enable Debug and collision wireframes. Inspect position,
   grounded/blocked flags, movement/animation state, and camera obstruction.
7. At mobile width, hold directional controls, toggle Run, drag the scene,
   and use the distance buttons. Confirm the HTML directory remains usable.
8. Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`. For an
   independently approved production browser check, use `npm start` and verify
   the development-only diagnostics are absent.

Phase 03 acceptance criteria are met in the tested development environment and
real Rapier tests. The production browser and device limits above remain explicit.

References: [Rapier character controller](https://rapier.rs/docs/user_guides/javascript/character_controller/),
[Kenney Mini Characters](https://kenney.nl/assets/mini-characters).
