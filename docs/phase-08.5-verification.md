# Phase 08.5 — Immersive fullscreen world interface

## Scope and result

`/world` now uses a dedicated viewport shell with the canvas as its base layer.
The site header, page title, scene frame, introduction, and stacked directory
were removed from this route. The menu and conventional portfolio retain their
document layouts. The existing NPCs, branching dialogue, discoveries, map,
building interactions, player controller, collision, camera, and portfolio data
continue to drive the experience.

“Fullscreen” here means filling the browser viewport. No browser Fullscreen API
permission is required, and browser toolbars are not programmatically hidden.
Previously delivered Phase 08 files were already modified/untracked at the
start of this phase and were preserved.

## Changed files in this phase

| Files | Change |
| --- | --- |
| `src/app/world/layout.tsx` (new) | Dedicated route shell, route CSS imports, safe-area viewport metadata. |
| `src/app/world/page.tsx` | Direct world entry and a script-free portfolio/menu fallback. |
| `src/app/world/loading.tsx` (new) | Loading UI stays inside the immersive layout. |
| `src/app/world/overlays.css` (new) | Shared world overlay variants, compact dialogue, lighter project/skills/archive presentation. |
| `src/app/styles/world.css` | Full viewport layers, floating HUD, controls, prompts, safe areas, touch/landscape foundations, fallback. |
| `src/app/globals.css` | World styles are loaded by the world route instead of the root document. |
| `src/app/exploration.css` | Removed the reserved dashboard-style toolbar and its responsive rules. |
| `src/app/styles/components.css` | Shared modal title/subtitle layout. |
| `src/components/world/world-shell.tsx` (new) | Semantic main landmark, hidden title, fixed viewport stage, route scroll-lock lifecycle. |
| `src/components/world/world-loading.tsx` (new) | Centered loading status with real alternative-route links. |
| `src/components/world/world-client.tsx` | Uses the immersive loader during capability checks and module loading. |
| `src/components/world/world-fallback.tsx` | Readable contained fallback with working Quick Portfolio and Menu actions. |
| `src/components/world/world-canvas.tsx` | Separate scene, HUD, and panel layers; existing rendering/physics composition retained. |
| `src/components/world/hud/world-hud.tsx` (new) | Floating location/objective/progress and Journal/Map/Settings/Menu actions. |
| `src/components/world/hud/pause-menu.tsx` (new) | Native pause overlay with Resume, Settings, and alternative routes. |
| `src/components/world/player/player-hud.tsx` | Detailed controls/Wave/distance/Pause behind Controls, small hint, preserved touch controls. |
| `src/components/world/player/player-diagnostics.tsx` (new) | Opt-in development metrics and collider checkbox, 4 Hz ref updates. |
| `src/stores/world-debug-store.ts` (new) | Ephemeral diagnostics state, reset on leaving the world, never persisted. |
| `src/components/settings.tsx` | World presentation variant, secondary portfolio/menu links, development-only tools inside a disclosure. |
| `src/components/settings-button.tsx` | Named compact HUD action. |
| `src/components/ui/interface-icon.tsx` | Two original inline icons for Menu and Controls. |
| `src/components/ui/modal.tsx` | Reusable document/overlay/dialogue presentations, optional subtitle/leading portrait, same native lifecycle. |
| `src/systems/ui/scroll-lock.ts` (new) | Shared, idempotent scroll-lock leases for routes and overlays. |
| `src/systems/ui/modal-lifecycle.ts` | Uses the shared scroll lock and releases it if native opening fails. |
| `src/components/world/exploration/exploration-interface.tsx` | Journal/map use the shared overlay; toolbar replaced by WorldHUD. |
| `src/components/world/dialogue/dialogue-interface.tsx` | Small portrait and NPC role join the title; removes repeated speaker chrome. |
| `src/components/world/interactions/building-panel-manager.tsx` | In-world content overlay, concise introduction and return controls. |
| `src/components/world/interactions/location-notification.tsx` | Quiet village/location label. |
| `src/components/world/interactions/proximity-prompt.tsx` | Compact named “Press E to speak/enter” prompt. |
| `tests/ui.test.tsx` | Shell/HUD/control semantics, shared route/dialog locks, failure cleanup, debug state isolation. |
| `tests/portfolio-build.test.mjs` | Production world shell, script-free exits, viewport metadata, and removed page/debug chrome. |
| `README.md`, this report | Current architecture, controls, modified-file inventory, limitations and verification. |

No package or asset was added in Phase 08.5. `package.json` and font additions
already present from Phase 08 are preserved. `package-lock.json`, `AGENTS.md`,
portfolio data, world coordinates, dialogue trees, quest triggers, simulation,
and collider definitions were not changed by this phase. Next may regenerate
`next-env.d.ts` when switching between development and production type paths.

## Layout and layering

1. `WorldLayout` wraps the route in `WorldShell`. The shell has fixed viewport
   bounds, `100dvh` with a `100vh` fallback, isolation, and a semantic main
   landmark. It has no maximum content width, outer padding, or frame. A hidden
   h1 and the existing Skip to content link preserve document navigation.
2. The stage/canvas fills the shell. React Three Fiber continues measuring its
   container normally. No camera/controller rewrite is needed for the new size.
3. An absolute HUD at z-index 10 is pointer-transparent outside its controls.
   Location, objective, and discovery count float at top-left; four named actions
   float at top-right. The interaction prompt sits at bottom-center. Instructions
   and Controls occupy lower corners. Safe-area insets protect all four edges.
4. The panel layer at z-index 20 contains the existing building, journal/map,
   dialogue, and new pause presentations. Native `showModal()` moves active
   dialogs to the browser top layer. Settings uses the same presentation even
   though its provider remains in the shared root layout.
5. The shell and dialogs acquire separate leases on one scroll lock. Closing a
   panel cannot restore document scrolling while the shell still owns a lease.
   Navigation cleanup restores the original root/body overflow and overscroll
   values after the final owner releases. Release is idempotent.

The route-specific world styles are not tied to the conventional portfolio's
parchment page wrapper. Overlay selectors explicitly target the world variant,
so returning to the menu keeps its document modal design.

## HUD, overlays and controls

- Journal/Map use their existing guarded state transitions, progress data, and
  world-derived map. The location and walking destination still come from the
  existing stores. A tracked route opens the map; Clear retains its prior action.
- Controls is a small disclosure with existing instructions, Wave, distance,
  and Pause actions. Escape closes it before pausing. Clicking outside, moving
  focus away, or opening a blocking panel dismisses it. Existing input guards
  prevent typing/navigating these controls from moving the resident.
- Manual pause is a native overlay. Opening Settings preserves the manual pause;
  closing Settings returns to Pause. Resume/Close/Escape resumes exploration.
  Quick Portfolio remains secondary inside Pause and Settings.
- One `Modal` primitive owns accessible names, native keyboard containment,
  Escape handling, heading focus, and deferred restoration. The existing
  dialogue-to-content handoff does not restore canvas focus over a new dialog.
  World panels return to the canvas; Settings restores its trigger.
- The dialogue presentation docks near the bottom, with a 42px portrait, NPC
  name/role, readable text, and simple choices. Text skipping, reduced motion,
  branching, guidance actions, and player pause remain intact. Large choice
  sets scroll within the dialog rather than expanding the document.
- Project details remain within the Guild overlay, with their existing large
  screenshots, challenge, solution, contribution, stack, outcome, and verified
  actions. Skills, archives, and contact reuse the same real content components.
- Diagnostics appear only after opening Settings → Developer tools in a
  development build. There is no debug action in the standard HUD. Production
  has neither the diagnostic control nor visible collider/debug UI.

## Minimal premium medieval styling

Warm ivory panels, forest-green typography/actions, thin bronze borders, modest
rounding and soft shadows replace the full-width walnut bar and heavy framing.
The world remains visible around overlays through a light scrim, with no blur,
large ornamental border or new texture. Local Cinzel headings, readable Source
Sans 3 controls and Georgia prose continue the established typography. Professional
case-study text is unchanged. Opening transitions take 160ms; the existing 180ms
close lifecycle is retained. OS and saved reduced motion disable these animations.

On narrow screens, actions retain accessible names while their visible labels
collapse to icons. Status moves below them. Touch movement remains available;
Run, Controls, hints and prompts use separate lower-screen positions. Short
landscape layouts hide optional status detail/instructions to make room; Journal
and Map still expose the full objective information. Portrait, 200% zoom, actual
cutouts and real touch devices need the manual checks below.

## Verification

Final automated results follow. Checks cover logic and generated HTML; they are
not a substitute for live layout/focus inspection.

- `npm run typecheck`: passed, including generated route types. Production
  compilation also passed strict TypeScript checks.
- `npm run lint`: passed.
- `npm test`: 63 passed across seven suites, including seven UI tests.
- `npm run build`: production compilation and route generation passed.
- `npm run test:portfolio:build`: 3 passed, including the distinct world shell,
  safe-area viewport metadata, no-JavaScript exits, conventional portfolio, and
  all five project case studies.
- UI coverage includes interleaved route/modal teardown, idempotent release,
  failed native opening, focus handoff, shell/HUD semantics, pause routes,
  debug-state isolation, settings, text contrast tokens, and font integrity.
- Existing Rapier initialization and Three.js CommonJS deprecation warnings
  remain nonfatal in Node tests. No unrelated dependency upgrade was attempted.
- `npm run dev`: ready on port 3000 in 989ms after refreshing the existing,
  verified workspace server. It remains running for review. An earlier startup
  attempt detected that same server and refused a duplicate; no browser request
  was made on the automatically suggested alternative port.
- `git diff --check`: passed.

The initial modal test fixture lacked the newly required root-element style
object. It was extended to model both root and body scroll state; the application
did not need a fallback for an absent `documentElement` in a real browser.
The old development log recorded a transient missing `overlays.css` import while
the new route files were being written. The file is present, final production
compilation passes, and the workspace development server was refreshed after
the files were complete. Live browser console/HMR behavior remains untested.

## Manual testing

1. Run `npm run dev` and enter `/world` directly and from the menu. At 1440×900,
   1024×768, 768×1024, 375×812, 320×568, and short landscape sizes, confirm the
   canvas fills the viewport, no document scroll appears, and no page header or
   directory surrounds the game. Resize with the scene running and inspect edges.
2. Use Tab/Shift+Tab through the floating actions. Confirm labels/focus are clear,
   the scene receives keyboard focus, and HUD gaps allow dragging the camera.
   Open Controls, try Wave/distance, and verify Escape or outside click closes it.
3. Walk/run/turn, approach buildings and NPCs, and activate the bottom prompt
   with E or click. Confirm correct destination, preserved position, no movement
   while navigating the overlay, reachable sticky Close, and return to the scene.
4. Speak to all five NPCs. Check the compact identity/portrait, skip/reveal, choices,
   directions, and each portfolio handoff. Escape must close only the topmost
   active dialog, with no camera focus stolen during a handoff.
5. Open Journal/Map, track and clear an objective, and complete a real discovery.
   Confirm progress and destination summaries still agree and refresh persists.
6. Press Escape with the canvas focused. Check Pause, Settings, then Escape:
   Pause should return. Resume and press a fresh movement key. Open Settings
   normally too; quality, sensitivity, volumes, reduced motion and saving remain.
7. Inspect every building overlay, Guild record and gallery, workshop group,
   archive timeline and contact action. Verify only genuine supplied actions are
   shown, long content scrolls internally, and the world remains visible behind.
8. Use Menu and Quick Portfolio from Pause/Settings. Confirm `/portfolio` scrolls
   normally after leaving the world, including while a modal was open. Navigate
   back and forth repeatedly; check stale pauses, scroll locks and hydration errors.
9. Disable JavaScript or WebGL and check the working HTML portfolio/menu escape.
   Inspect actual load/error/context-loss states and ensure no unrecoverable UI.
10. Test 200% zoom, reduced motion, safe-area emulation and a real touch device.
    Check corner controls, prompts, long names, dialogue scroll, and background
    scrolling. In development only, opt into diagnostics via Settings; confirm
    they start hidden/reset and are absent from a production session.

## Acceptance and limitations

The implementation establishes the requested viewport shell, canvas-first
layers, compact floating HUD, unified in-game overlays, minimal medieval
presentation, secondary conventional-mode access, and hidden debug presentation.
Automated checks protect existing mechanics/content and generated route output.

Full acceptance remains **pending live browser verification** of perceived
immersion, responsive overlap, native focus/Escape behavior, hydration/console
output, and gameplay transitions. Local-browser access was previously declined;
this phase did not use alternate ports, headless browsers, screenshots, or other
surfaces to bypass that decision. No live visual or gameplay pass is claimed.

This phase lays responsive foundations; it does not claim a complete mobile
controls redesign or a full accessibility audit. Audio playback and a verified CV
remain unavailable as before. No portfolio facts or assets were invented.
