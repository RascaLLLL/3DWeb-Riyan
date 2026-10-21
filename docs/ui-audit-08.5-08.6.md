# Phase 08.5 / 08.6 UI audit and fixes

## Scope and evidence

Read `AGENTS.md` and inspected the world route/layout, viewport shell, scene/HUD
layers, native modal lifecycle, scroll locks, keyboard guards, Controls/touch
layout, dialogue, building panels, shared portfolio records and responsive CSS.
The installed Next.js CSS guide was consulted for stylesheet persistence across
client navigation. Previous uncommitted Phase 08–08.6 work was preserved.

This is a source/logic/compiled-output audit. Earlier local-browser access was
declined; this audit did not use another port, browser or screenshot surface to
bypass that decision. Rendered overlap, screen-reader output and perceived
immersion are not claimed as observed results.

No new gameplay or portfolio feature, dependency, asset, route or content fact
was added. Physics, movement, camera, quest events, dialogue graphs, persistence
and portfolio data remain the existing systems.

## Issues found and fixes

| Finding | Evidence and fix |
| --- | --- |
| Building overlays still resembled webpage content stacks. | Most repeated a building title, purpose subtitle, generic introduction, section heading, then record title. Single-section panels now start with their real content under the modal title/subtitle. Only the Guild keeps its useful board instruction. Library retains its three distinct section headings. |
| Library heading hierarchy was incorrect. | Library section titles and nested work/education/certification titles all used h3. Village entries now use h4 below h3 sections; conventional portfolio records retain h3 below their existing h2 sections. A regression test verifies that only tags change, not records. |
| HUD close focus was overwritten. | The modal helper focused its invoker, then always ran the canvas callback. It now returns to a usable invoker and uses the canvas only as fallback. Hidden, disabled, removed, body, or unfocusable invokers cannot capture restoration. Same-commit modal handoff protection remains. |
| Openers could be blurred before they were captured. | Settings/Journal/Map natively disabled themselves as panel state changed, before the modal effect read the active element. Openers now use guarded actions and aria-disabled while a native modal owns background inertness. Journal/Map remain natively disabled before the game starts. |
| Dialogue branch replacement could discard keyboard focus. | Choosing a reply unmounted the focused button. Each new keyed turn now focuses its readable paragraph when the conversation is already open. Initial NPC-heading focus and the text-reveal checkbox retain their existing roles. |
| Typewriter presentation had accessibility noise. | Paragraph-wide live-region mutations included every character reveal; the finished no-op skip button remained in the normal Tab order. Full text remains available to assistive technology, without the per-character live region. The finished skip control keeps its layout/focus stability but leaves the Tab sequence. |
| Touch Run could cover the open Controls popup. | Both occupied the area immediately above the Controls summary, with Run later in source order. Controls now has explicit stacking priority. Its scroll height and width account for safe areas and the upper HUD. |
| Short-screen behavior was inconsistent. | All walking guidance disappeared in short landscape mode, while narrow landscape dialogue was forced back into two columns. Guidance titles now stay available with compact ellipsis/full accessible names and tooltips where space allows. Narrow dialogue remains one column. Only very short/narrow viewports omit the guidance detail. |
| Screen-size hints could misidentify the input device. | A narrow desktop window said “Touch to Move.” Device-specific hint text now follows pointer capability; the existing small-screen movement buttons remain available. |
| Loading navigation could overlap the loading indicator. | Alternative links were absolutely positioned below a centered indicator with a fixed minimum height. They now occupy a separate grid row; short viewports can scroll rather than stack content on top of itself. |
| Some decorative HUD surfaces intercepted the scene. | The location/status card consumed pointer input even where it had no action. Decorative areas now let camera dragging pass through; route and clear buttons retain their hit areas. |
| Minor styling/discoverability inconsistencies remained. | Landmark/error surfaces and Settings/Pause dividers now use the shared tokens. Icon-only actions have native titles as well as accessible names. |

The current route itself had **no visible page header, large title section,
centered scene wrapper, full-width dashboard bar, or stacked directory** left
to remove. The visible document feel was concentrated in content overlays.
Those findings were not used as a reason to rebuild the shell or engine again.

The Controls placement, modal focus overwrite/opener disabling, short-landscape
rules and loading composition came from the fullscreen UI work. Duplicated
building headers and dialogue-branch focus were existing weaknesses retained
through the refactor. This distinction is based on the implementation/history,
not a claim that every symptom was reproduced in a browser.

## Changed files

- `src/systems/ui/modal-lifecycle.ts`, `src/components/ui/modal.tsx`: prefer a
  valid invoker; renamed the optional canvas restoration contract to
  `fallbackFocus` to reflect when it runs.
- `src/components/world/{dialogue/dialogue-interface,hud/pause-menu,exploration/exploration-interface,interactions/building-panel-manager}.tsx`:
  use the fallback contract; building panels remove duplicated introductory UI.
- `src/components/world/dialogue/dialogue-content.tsx`: focus new conversation
  turns, remove per-character live updates and the completed skip Tab stop.
- `src/components/{settings-button,world/hud/world-hud,world/interactions/destination-guidance}.tsx`:
  guarded opener state, preserved invoker focus, and complete icon/route titles.
- `src/components/portfolio/{archive-records,portfolio-section-content}.tsx`:
  heading levels appropriate to Library sections versus conventional pages.
- `src/app/styles/{components,world}.css`: aria-disabled appearance, Controls
  stacking/safe-area limits, pointer-through decoration, device-appropriate
  hints, loading flow and short-screen fixes.
- `src/app/world/overlays.css`: remove repeated-heading spacing, maintain archive
  typography after semantic fixes, consistent dividers, and narrow dialogue columns.
- `tests/ui.test.tsx`: focus restoration regression cases, including valid,
  removed, hidden, disabled and unfocusable invokers plus existing handoff/locks.
- `tests/portfolio.test.tsx`: Library heading hierarchy and identical record output.
- `README.md`, this report: current focus contract, findings and review steps.

No dependencies were installed. `package-lock.json`, `AGENTS.md`, world data,
portfolio facts, game stores and engine simulation were not changed by the audit.

## Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 64 passed across seven suites, including the expanded focus logic
  and new archive heading regression check.
- `npm run build`: passed, including strict TypeScript and all route generation.
- `npm run test:portfolio:build`: 3 passed, covering the distinct world shell,
  conventional portfolio HTML and all five case-study routes.
- `git diff --check`: passed.

The focus tests exercise lifecycle decisions with a lightweight DOM stand-in;
they do not exercise native Tab containment or prove browser/screen-reader focus
behavior. No tests were added merely to mirror CSS declarations. Existing
nonfatal Rapier initialization and Three.js CommonJS warnings remain in Node tests.

## Manual testing checklist

1. Enter `/world` directly and from the menu at 1440×900, 1024×768, 768×1024,
   375×812, 320×568, 568×320 and 320×320. Include 200% zoom and real cutout/safe
   areas. Verify full viewport coverage and no external page scrolling/chrome.
2. On touch/coarse-pointer layouts, open Controls. Run must not cover its lower
   content or actions. Scroll its instructions, use distance/Wave/Pause, and
   dismiss with Escape/outside click. Check its bounds below the upper HUD.
3. Use keyboard to open and close Journal, Map and Settings. Focus should return
   to their usable opening button, without jumping to the canvas. Open Map from
   walking guidance too. Tab through the restored controls and explicitly focus
   the scene to resume keyboard movement.
4. Activate an entrance or NPC via E and by clicking its prompt. Close the panel
   after the prompt has disappeared: the canvas should receive fallback focus.
   Exercise Pause → Settings → Close → Pause → Resume and modal handoffs; focus
   must not go behind an active dialog or to a closed/disabled control.
5. Choose several dialogue branches with Enter/Space. New text should receive
   focus, remain fully readable to a screen reader, and not repeat on every
   typewriter tick. Finish/skip text while focused on skip, then Tab to a choice.
   Test reduced motion and the reveal checkbox without unexpected focus changes.
6. Inspect all building panels. Single-section destinations should not repeat
   their section heading/intro. Library should have h3 archive sections with h4
   records. Confirm every genuine record, image, link and TODO remains present.
7. At short heights, inspect active directions, progress, prompts and touch
   controls. Truncated direction titles remain named and open Map. Progress and
   objectives remain in Journal/Map when optional HUD details are omitted. Narrow
   landscape dialogue should remain a readable single column.
8. Drag the camera through passive status-card areas; interactive route/clear
   controls must still work. Check native hover titles for icon-only actions.
   Resize a fine-pointer desktop window: its movement hint must remain correct.
9. Check loading, no-WebGL, context-loss and no-JavaScript paths. Loading links
   must remain separated from the status and reachable at short heights.
10. Visit `/portfolio` and every case-study route, including with JavaScript
    disabled. Check normal document scrolling after leaving a dialog/world route.
    Inspect browser console, frame pacing and a real mobile device for regressions.

## Remaining weaknesses and immersion verdict

**The architecture is immersive:** the world owns the viewport, HUD occupies
floating regions, dialogs sit above the scene, and conventional portfolio mode
has a separate route. There is no remaining page-sized wrapper or header competing
with exploration. The audit fixes reduce the document feel within its overlays.

**Perceived immersion is not yet verified.** No live composition, overlap,
screen-reader/native focus, hydration/console or frame-rate pass was performed
because of the prior browser-access decision. Professional project/archive
records intentionally remain reading surfaces; long case studies can still feel
document-like inside an overlay. Very small/short viewports still rely on compact
HUD detail and Journal/Map for full information. This is not a completed mobile
redesign or a full accessibility certification.

The audit and source-level fixes are complete, with automated verification. A
claim that the route *truly feels* immersive needs the manual playthrough above.
