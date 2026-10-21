# Phase 08.6 — Minimal premium medieval visual polish

## Inspection and scope

Reviewed `AGENTS.md`, the fullscreen shell and route styles, shared modal/button
styles, floating HUD, location/guidance, dialogue, journal/map, and portfolio
presentation before editing. Read the installed Next.js CSS guidance, including
its warning about route stylesheet persistence. The new rules target world
classes; the conventional menu and portfolio keep their existing presentation.

This was a source inspection, not a live visual inspection. Local-browser access
was previously declined, and this phase did not bypass that decision. The prior
Phase 08/08.5 working-tree changes were preserved.

## Visual changes and decisions

- Four individually framed HUD actions now share one compact parchment cluster.
  Each action retains its accessible name and at least a 44px hit area. The
  cluster uses one soft floating shadow instead of four competing shadows.
- The smaller location card emphasizes the place in a readable serif. The
  repeated village branding is replaced by a quiet “Location” label. Objective
  labels, route titles, and discovery status have distinct text weights/sizes.
- Five small marks accompany the real discovery count. They are decorative and
  hidden from assistive technology; the status text still reports progress and
  the exact completion message. The display adds no state or progress logic.
- Walking guidance keeps the same map/clear actions. Its clear control is a
  restrained icon with an accessible name and native tooltip.
- Contextual prompts fit their names rather than occupying a fixed 360px card.
  At intermediate widths they rise above the lower corner controls, reducing
  the potential for collisions between hints and prompts. Existing touch/safe
  area positioning remains in place.
- Shared surface tokens establish one control radius, panel radius, border,
  divider, and shadow vocabulary. Warm opaque parchment preserves predictable
  text contrast over changing scenery. No blur or glass treatment was needed.
- Panels align header/body horizontal padding, use a clear display-title / serif
  section-heading / readable-body hierarchy, and limit prose to 66 characters
  where appropriate. Photos and multi-column content retain their available
  width. Primary and secondary actions use consistent spacing and sizing.
- Journal entries, map records, workshop groups, project notices/galleries,
  archive dates, certification records and contact links use quieter framing.
  Smaller section headings support the panel title rather than competing with it.
  The developer name and case-study title retain a stronger content hierarchy.
- Dialogue retains its compact bottom placement, small portrait and immediate
  choice access. Removed decorative 01/02 reply numbers, which were not keyboard
  shortcuts. Portfolio-opening choices have a subtle forest edge and stronger
  label. Text reveal, skip, branching, reduced motion and close behavior remain.
- The established 160ms opening / 180ms closing lifecycle is retained, with no
  new animations, timers, fonts, assets, renderer changes or per-frame updates.

## Modified files

| File | Purpose |
| --- | --- |
| `src/app/styles/tokens.css` | Shared world surface and typography tokens. Existing text colors remain intact. |
| `src/app/styles/world.css` | HUD/action cluster, location/objective hierarchy, progress marks, compact prompts, controls/fallback consistency, intermediate-width spacing. |
| `src/app/world/overlays.css` | Unified buttons, panel spacing/headers, content hierarchy, journal/map/skills/archive/contact styling, dialogue choices. |
| `src/components/world/hud/world-hud.tsx` | Decorative discovery marks and concise real progress text. |
| `src/components/world/interactions/location-notification.tsx` | Subordinate location caption. |
| `src/components/world/interactions/destination-guidance.tsx` | Concise guidance labels and named clear icon; same actions. |
| `src/components/world/dialogue/dialogue-content.tsx` | Remove decorative reply numbers; distinguish existing portfolio-opening choices. |
| `README.md`, this report | Current design decisions, modified files, verification and review steps. |

No dependencies were installed, removed or upgraded. No assets were introduced.
No engine, collision, camera, input lifecycle, dialogue graph, quest/persistence,
portfolio data, or route architecture was rewritten. No new tests were added
solely to assert reversible visual styling; the existing meaningful suites were run.

## Verification

Final automated results:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 63 passed across seven suites, including existing color-contrast,
  fonts, shell/HUD, modal lifecycle, player/physics, dialogue, discovery and
  content-integrity checks.
- `npm run build`: passed, including strict TypeScript and all route generation.
- `npm run test:portfolio:build`: 3 passed, covering the distinct world shell,
  conventional portfolio HTML and all five static case-study routes.
- `git diff --check`: passed.

Existing nonfatal Rapier initialization and Three.js CommonJS deprecation
warnings remain in Node tests. The development server already runs for this
workspace; no duplicate server or browser request was started for this phase.

## Manual review checklist

1. Open `/world` at 1440×900, 1024×768, 768×1024, 375×812, 320×568, and short
   landscape sizes. Check that the world remains dominant, names wrap cleanly,
   and status/action clusters remain separate. Include 200% zoom.
2. Walk near all five landmarks and villagers. Check content-sized prompts,
   lower corner hints/Controls, and touch controls at intermediate widths. Test
   the longest displayed names and objective titles rather than only spawn.
3. Open Journal/Map, track and clear a destination, complete a discovery, and
   refresh. Confirm the marks/count/quest status agree; map and clear actions
   remain understandable with mouse, touch and keyboard.
4. Open Settings and Pause. Check all labels, slider outputs, 44px control areas,
   visible focus, close actions and scroll access. Test manual Pause → Settings
   → Close → Resume; gameplay must remain paused while reading.
5. Talk to the villagers. Compare brief and long dialogue branches; check skip,
   multi-row choices, highlighted content actions, reduced motion, Tab/Enter,
   Escape, and dialogue-to-building focus handoffs.
6. Read every building panel, a long project case study, skills, work experience,
   education, certifications and contact. Check aligned spacing, line lengths,
   large images, tags, internal scrolling and the sticky close control.
7. Use Quick Portfolio from Settings/Pause. Confirm the conventional portfolio
   remains readable and scrolls normally after leaving the world. Check the
   no-WebGL / no-JavaScript fallback and menu presentation too.
8. Inspect console output and compare frame pacing during exploration and open
   overlays on desktop and a real touch device. No live performance comparison
   or visual accessibility audit is claimed from automated tests.

## Acceptance and remaining rough edges

The requested hierarchy, quieter HUD, consistent surfaces/buttons, readable
content, and restrained dialogue presentation are implemented. Automated checks
cover existing behavior; full visual acceptance remains pending browser review.

Actual overlap, safe-area behavior, subjective composition, native focus/console
behavior and frame rate remain unverified because of the earlier browser-access
decision. Short landscape layouts intentionally omit optional HUD detail already
available from Journal/Map. Full mobile control redesign is outside this polish
phase. Existing missing CV/content fields and inactive audio preferences remain
honestly identified; this phase adds no fictional replacements.
