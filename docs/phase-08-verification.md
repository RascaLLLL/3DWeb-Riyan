# Phase 08 — Premium medieval interface

## Delivered scope

A shared parchment/wood design system now covers the main menu, loading UI,
HUD, dialogue, journal/map, skills, project records, archives, contact, and
settings. Existing game systems and portfolio facts remain the source of truth.
The original main-menu map is clearly described as an illustration; the live
map continues to derive coordinates from the world configuration.

## Modified files

- `src/app/globals.css` and new `src/app/styles/{tokens,base,components,menu,world}.css`:
  centralized palette and fonts, reusable controls/panels, visible focus states,
  responsive menu/HUD, reduced motion, and restrained ornamentation.
- `src/app/{portfolio,exploration}.css`: readable workshop groups, project
  screenshots/case studies, archive timeline, contact links, journal progress,
  and the world-derived map using the shared tokens.
- `src/app/{layout,page}.tsx`, `src/app/world/page.tsx`, and
  `src/components/menu/{village-map,village-entry-link}.tsx`: local fonts, title
  hierarchy, actual navigation pending state, and updated presentation copy.
- `src/components/ui/{modal,interface-icon}.tsx` and
  `src/systems/ui/modal-lifecycle.ts`: original SVG icons, sticky modal header,
  scroll lock, title focus, and handoff-safe focus restoration.
- `src/components/{settings,settings-button}.tsx`, `src/data/interface.ts`,
  `src/types/game.ts`, `src/stores/game-store.ts`, and
  `src/systems/player/input.ts`: labelled preference groups, validated persisted
  camera sensitivity, live drag multiplier, and native-dialog input exclusion.
- `src/components/world/exploration/{exploration-interface,quest-journal}.tsx`,
  `src/components/world/interactions/destination-guidance.tsx`, and
  `src/components/world/world-canvas.tsx`: compact toolbar, location/guidance
  moved into reserved layout space, completion marks, and direct map access.
- `src/components/world/dialogue/dialogue-content.tsx`: stable text-reveal height
  and skip control so choices do not move as characters appear.
- `public/assets/fonts/`: two WOFF2 files, two unmodified OFL notices, provenance
  README; `public/assets/README.md` records the additions.
- `tests/ui.test.tsx`, `tests/player.test.ts`, `package.json`: UI regression suite
  and real input sensitivity checks, included in `npm test`.
- `README.md` and this report: architecture, settings, verification, and limitations.

`AGENTS.md`, portfolio data, world coordinates, quest triggers, physics, player
simulation, NPC models, and dialogue trees were not rewritten.

## Decisions and dependencies

- No dependencies were installed, upgraded, or removed; lockfile unchanged.
- Cinzel and Source Sans 3 are bundled locally under SIL OFL 1.1, with verified
  upstream licenses, source URLs and hashes. Combined WOFF2 payload: 44,076 bytes.
- Body text uses readable Source Sans 3 or Georgia, not the display face.
- Muted gold decoration is separated from darker gold text. The suggested wood
  color was slightly darkened to meet the tested text contrast threshold.
- Native `<dialog>` retains the browser's focus containment and topmost Escape
  behavior. The shared helper handles scrolling/restoration without a custom
  keyboard trap. A queued restoration cannot override a newly opened modal.
- Toolbar layout reserves space above the canvas. Location and guidance no
  longer compete with movement controls and interaction prompts within it.
- Existing blocking-panel state still pauses movement. Camera sensitivity is
  the only camera behavior change; geometry, collision, and simulation remain
  outside the UI work.
- Transitions are short (140/180ms). The decorative map has one subtle settling
  animation; reduced motion disables it. Navigation has no artificial delay.
- Existing v1 settings remain compatible: sensitivity defaults to 1× if absent,
  clamps to 0.4–2.0, and rejects nonnumeric/nonfinite input.

## Verification

Results from this implementation are recorded below. Native browser behavior is
not inferred from the lightweight DOM test harness.

- ESLint: passed.
- Strict typecheck including generated Next routes: passed.
- Existing six suites: 56 passed, covering world, Rapier/player/input, entrance
  interaction, dialogue, portfolio integrity/HTML, and optional exploration.
- New UI suite: 5 passed, covering sensitivity compatibility/persistence,
  labelled settings, focus/scroll lifecycle and handoffs, color contrast, and
  licensed local font signatures/hashes. Player input tests additionally compare
  actual drag deltas at 0.5× and 2×.
- Production build: passed; all existing routes generated, including five
  static project case studies.
- Post-build script-free portfolio/case-study HTML: 2 passed.
- Full aggregate `npm test`: 61 passed across seven suites.
- `npm run dev`: ready on the default port in 704ms. The owned server was then
  stopped; no browser navigation was performed.
- `git diff --check`: passed. Git reports normal LF-to-CRLF conversion notices
  on this Windows checkout; no whitespace errors were found.

The contrast test checks normal-text token combinations at >=4.5:1 and focus
colors at >=3:1. It does not certify all rendered content or replace a full
accessibility audit. Modal tests check application lifecycle logic, not browser
Tab cycling, actual native Escape dispatch, or screen-reader output.

Existing nonfatal Rapier initialization and Three.js CommonJS deprecation
warnings remain in Node physics tests. No unrelated engine upgrade was made.
Initial new checks caught a just-under-4.5:1 wood/shaded-paper pair (fixed by
darkening wood) and an overly narrow test matcher for the existing audio notice
(corrected to match its actual wording).

## Manual browser checks still required

Local-browser origin access was declined earlier in this project. No alternative
port, headless browser, or other surface was used to bypass that decision.
Screenshots, live WebGL/UI inspection, console monitoring, native focus trapping,
and responsive overlap checks are not claimed as completed for Phase 08.

1. Run `npm run dev`. Inspect `/`, `/world`, and `/portfolio` at 1440×900,
   1024×768, 768×1024, 375×812, and 320×568; also test 200% zoom. Check wrapping,
   scroll access, no horizontal overflow, and no toolbar/prompt/touch overlap.
2. On the menu, use Tab/Shift+Tab and Enter. Confirm visible focus on green and
   parchment buttons. Open Settings, confirm the heading receives focus and Tab
   remains in the dialog, then Escape closes it and returns focus to Settings.
   Repeat after scrolling a long page: scroll position should be preserved.
3. In the village, hold movement then open a blocking panel. Check movement
   stops and slider/choice arrow keys cannot move the resident. Change camera
   sensitivity to 0.4× and 2.0× and compare equal drags; reload to check saving.
   Confirm quality changes and manual pause still work.
4. Talk to a villager, skip text, follow a choice, and open its portfolio panel.
   Watch focus through the handoff; the canvas must not take focus until the
   panel closes. Escape should close only the active panel. Check portraits,
   readable text, stable choices, and immediate text with reduced motion.
5. Open Journal and Map, track a discovery, return to walking, open the map via
   the route indicator, and clear tracking. Check location text and progress
   remain legible. Complete a discovery and verify the checkmark/text agrees.
6. Open all five building panels. Inspect large project captures, technology
   tags, workshop groups, archive roles/dates, and contact links. Scroll long
   records: Close should remain reachable. Verify no made-up CV/demo actions.
7. Toggle saved reduced motion and emulate the OS preference. Check menu,
   loading, dialogue and panel transitions. At reduced motion, text should
   appear immediately and no transition should delay resuming exploration.
8. Check `/portfolio` and each project route with JavaScript disabled. Verify
   readable content, contact links, local-font fallbacks, and all section links.
9. Check browser console for fatal errors and test touch controls on a real
   coarse-pointer device. Confirm the layout remains professional and uncluttered.

## Acceptance status

Implementation and automated checks support a consistent shared visual system,
readable content, functional panel/state wiring, visible focus, reduced motion,
and preserved gameplay. Full Phase 08 acceptance is **pending manual browser
verification** of rendering, overlap at common sizes, native modal keyboard
behavior, and live transitions; these are not established by build/unit checks.

Audio playback is still outside this phase: volume sliders save clearly labelled
future-audio preferences. A real CV remains unavailable; existing honest TODO
text is preserved. No credentials, projects, outcomes, links, or resume were
invented to fill interface space.
