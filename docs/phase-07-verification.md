# Phase 07 — Exploration quests and journal

Implemented on **21 October 2026** in `D:\THEVILLAGE`.

## Delivered scope and decisions

Five optional discoveries guide visitors through the existing portfolio. There
are no content locks, required order, rewards, levels, timers that give progress,
or teleports. The First Encounter is initially suggested; tracking can be stopped
or changed, and untracked objectives still complete. Completing the selected
objective clears tracking without assigning another obligation.

Successful conversation starts with Alden, Borin, Lyra, and Rowan complete their
respective objectives. Opening the Guild project board through its entrance or
Elara completes The Guild’s Records. Merely approaching a target, talking to
Elara without opening the board, choosing directions, opening another building,
or waiting does not complete it. Existing range, line-of-sight, focus, blocking
panel, and cooldown checks remain authoritative. Repeated events are idempotent.

The dialogue complete-objective action remains supported, checked against its
actual speaker and the canonical quest definition. The old transient guide
completion array was removed, so the journal and dialogue share one completion
source. No portfolio information or real personal content was changed.

Journal and Map are HTML controls above the canvas. They share a native modal
with keyboard-operable page buttons, Escape/Close, focus restoration, bounded
scrolling, responsive layout, and the existing reduced-motion treatment. Both
pause physics and clear held input through the existing blocking-panel lifecycle.
An explicit manual pause survives closing. Cooldown prevents an E request from
opening another interaction immediately on return.

The journal shows current, unstarted, and completed objectives, destinations,
discovery descriptions, and semantic progress. After five completions, it and
the small toolbar display the exact requested completion message. Exploration
and all portfolio access remain available.

The SVG map derives terrain bounds, square, well, roads, rotated building
footprints, labels/numbers, target positions, and entrance points from world/NPC
configuration. North is -Z, east is +X, and SVG yaw accounts for the screen Y
axis. The player snapshot is taken after the paused map mounts, with no per-frame
React state/store writes. A blue triangle/halo marks the resident, a gold diamond
the tracked objective, and a gold outline the walking destination. A labeled HTML
destination list provides keyboard/touch access. Mark path highlights a landmark
and closes the map; it never moves the resident. Manual directions take precedence
over a tracked building; Clear directions clears both. Tracking another objective
clears a manual destination. No fast-travel or safe-spawn implementation is needed.

## Persistence

The dedicated Zustand store uses `riyan-village-exploration-v1`, schema version 1,
with explicit client hydration before game interactions start. Only completed IDs
and the selected objective are saved. Progress totals/percentages and all three
statuses are derived, so saved counters cannot contradict completion IDs.

Hydration validates known IDs, removes duplicates, rejects invalid selections,
and drops tracking of a completed objective. Incompatible versions start a fresh
optional journal. Malformed JSON, denied storage, and quota exhaustion do not
prevent in-memory progress. Runtime positions, scene state, pauses, open dialogs,
and manual directions are excluded. World exit/context loss preserve discoveries.
Storage is local to one browser; disabled storage cannot survive a refresh.

## Modified files

- `src/types/quest.ts`: objective/event/progress/status/record contracts.
- `src/data/quests.ts`: five definitions and the completion message.
- `src/data/discoveries.ts`, `src/types/dialogue.ts`: dialogue objective IDs and
  validation use the canonical catalog.
- `src/systems/exploration/progress.ts`: validation, event matching, idempotent
  completion, and derived statuses.
- `src/systems/exploration/map.ts`: world/SVG transforms and target/location lookup.
- `src/systems/exploration/panels.ts`: guarded journal/map open, close, and cooldown.
- `src/stores/quest-store.ts`: versioned persistence, selective writes, hydration,
  and a testable store factory.
- `src/stores/dialogue-store.ts`, `src/stores/interaction-store.ts`: successful
  interaction events; validated dialogue objective hook.
- `src/stores/guidance-store.ts`: manual directions only, removing duplicate progress.
- `src/types/game.ts`: journal/map blocking-panel types.
- `src/hooks/use-walking-destination.ts`: manual/selected-objective guidance.
- `src/components/world/exploration/quest-journal.tsx`: semantic progress/records,
  tracking controls, destinations, and direct HTML portfolio link.
- `src/components/world/exploration/village-overview-map.tsx`: configuration-derived,
  labeled, accessible SVG.
- `src/components/world/exploration/exploration-map.tsx`: paused player snapshot,
  objective summary, legend, and walking destination list.
- `src/components/world/exploration/exploration-interface.tsx`: toolbar and shared
  native journal/map dialog.
- `src/components/world/world-client.tsx`: hydrate discoveries before starting.
- `src/components/world/world-canvas.tsx`: compose HTML exploration UI, reserve
  toolbar space, and clean up transient panels without resetting progress.
- `src/components/world/dialogue/dialogue-interface.tsx`: canonical discovery state.
- `src/components/world/environment/building-signs.tsx`, `landmark-labels.tsx`,
  and `src/components/world/interactions/destination-guidance.tsx`: restore saved
  quest tracking through the existing subtle marker/card system.
- `src/data/dialogues.ts`: Alden explains the optional journal/map.
- `src/app/world/page.tsx`, `src/app/exploration.css`: chapter/instructions and
  responsive parchment journal/map/toolbar styles.
- `tests/exploration.test.tsx`, `tests/dialogue.test.ts`, `package.json`: eleven
  new checks, canonical discovery assertions, and the focused/aggregate script.
- `README.md`, this report: current architecture, scope, storage, and manual checks.
  Next may regenerate `next-env.d.ts` through normal typegen/dev/build commands;
  it was not hand-edited.

Earlier uncommitted Phase 06 files were preserved. No unrelated rewrites,
dependency/lockfile changes, external assets, APIs, or new environment variables.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed (Next route generation plus strict TypeScript).
- `npm test`: all **56 tests** passed across six suites, including **11** new
  exploration checks. These exercise all five actual interaction paths, the Guild
  entrance/Elara alternatives, no-progress guards, idempotence, out-of-order/
  untracked completion, saved-state reload, malformed/incompatible storage,
  storage denial/quota failure, explicit pause/cooldown, rotated map coordinates,
  roads/targets/player markers, and server-rendered journal/map semantics.
- `npm run build`: passed, with `/`, `/world`, `/portfolio`, and all five
  case studies generated successfully.
- `npm run test:portfolio:build`: both script-free built HTML checks passed.
  Every portfolio section/project/contact remains present independently of 3D
  or quest progress.
- `npm run dev`: ready on port 3000 in 865 ms; the owned server was then stopped.
  Browser route navigation was not attempted.
- Standalone SVG map: rendered locally with the already installed Sharp dependency
  and inspected as a raster. Northern labels were moved away from entrance markers;
  the player gained a small halo. This checks only the SVG illustration, not the
  application, native dialog behavior, WebGL, or mobile/browser rendering.

No dependencies were installed. Existing nonfatal Rapier initialization and Three
CommonJS deprecation warnings remain in physics tests. There were no lint,
typecheck, test, or production-build errors in this phase.

Browser-origin approval previously rejected access to the local world. That
existing denial was respected; no browser workaround or console-clean claim is
made. Live browser/native-dialog focus, screen-reader behavior, responsive layout,
WebGL rendering, and end-to-end movement remain manual checks. Automated state
and static-render tests do not establish those browser results.

## Manual testing

1. Run `npm run dev`, open `/world`, and use Tab/Enter to open Journal. On a
   fresh browser it should show 0/5, The First Encounter active, and four unstarted
   invitations. Stop tracking; content and free exploration remain available.
2. Talk to Alden, Borin, Lyra, and Rowan with E or their prompts. Open the Guild
   board using either its entrance or Elara’s Open choice. Check one completion
   each, including when untracked and in a different order. Reopen a conversation
   or board: counts must not increase. Talk to Elara without opening: no Guild
   completion. E behind a wall, out of range, or during a modal must give none.
3. Track an unfinished objective, use Find on map, inspect its exact NPC/entrance
   marker and building labels, and close. The subtle walking card/landmark should
   match. At each landmark, reopen the map and compare the blue marker to your
   world position using development Debug. North corresponds to decreasing Z.
4. Select Mark path in the map. Check that the building highlights, the map closes,
   the resident stays in place, and no objective completes. Clear directions;
   tracking should stop. Tracking from the journal clears a previous manual mark.
5. Hold movement while opening Journal/Map: movement must stop. Escape/Close must
   restore focus without stale held keys. A pre-existing explicit Pause stays
   paused. During NPC/building/settings dialogs the exploration toolbar is blocked.
6. Refresh with completed objectives and a selected unfinished objective. Both
   should restore; scene dialogs/positions should not. Leave and re-enter `/world`
   and confirm discoveries persist. Disable site storage and confirm an actual
   interaction still updates the in-memory journal; refresh persistence is then
   unavailable by design. Corrupting only this optional key must not break play.
7. Finish all five. Check 5/5 and “Every story in the village has been discovered.”
   Continue walking, talking, and opening every portfolio panel afterward.
8. Repeat journal/map controls at 375 px width, 200% zoom, reduced motion, and
   using only Tab/Shift+Tab/Enter/Space/Escape. Check scroll containment, focus,
   labels, and console. Verify `/portfolio` and all five case studies directly,
   at zero discoveries, with WebGL unavailable and JavaScript disabled.

## Acceptance assessment

All requested systems are implemented. Automated checks pass for all five
completion paths, progress persistence/validation, reliable interaction guards,
journal records, world-aligned map markers, optional tracking, and unrestricted
portfolio HTML. Full browser acceptance remains **pending manual verification**
of the checks above. No claim is made that live WebGL/UI acceptance was tested.
