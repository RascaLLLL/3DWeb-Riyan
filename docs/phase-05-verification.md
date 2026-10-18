# Phase 05 — NPC and dialogue system

Implemented on 18 October 2026 in `D:\THEVILLAGE`.

## Delivered scope

Five configurable medieval villagers now share the existing proximity/E manager
with building entrances. Elder Alden guides visitors near the well; Elara keeps
the guild approach; Borin stands by the forge; Lyra tends the library approach;
Rowan waits inside the gate. Their authored branching conversations explain
controls/destinations and open the matching portfolio interfaces.

Distinct procedural costumes and vector portraits replace any need for external
models. Player movement/physics pause during conversations, while visual frames
continue for turning, idle/talking gestures, and comfortable camera framing.
Close/Escape returns to exploration; portfolio actions transfer directly to the
existing panels without a scene reload or an unpaused gap.

## Modified files

- `src/types/npc.ts`, `dialogue.ts`: stable NPC, appearance, animation, tree,
  node, choice, action, effect, expression, and session contracts.
- `src/data/npcs.ts`, `dialogues.ts`, `directions.ts`, `discoveries.ts`: five
  villager definitions, building-relative placements, authored dialogue trees,
  walking guidance, and the small “Meet Elder Alden” objective hook.
- `src/systems/dialogue/engine.ts`, `validate.ts`: pure branching/Continue/action
  engine, bounded automatic transitions, validation, and safe failure results.
- `src/stores/dialogue-store.ts`, `guidance-store.ts`: transient conversation,
  closing lifecycle, panel handoff, direction highlight, and objective completion.
- `src/systems/interactions/npc-selection.ts`, `manager.ts`, `visibility.ts`:
  shared nearest-NPC/building arbitration, range/height/focus guards, wall checks,
  and reusable NPC ray predicate excluding only the addressed villager.
- `src/stores/interaction-store.ts`, `src/types/game.ts`: nearby NPC selection,
  shared cooldown, dialogue blocking state, guarded portfolio handoff.
- `src/components/world/npcs/npc-resources.ts`, `npc-costume.tsx`,
  `npc-character.tsx`, `village-npcs.tsx`: shared geometry/material ownership,
  five distinguishable costumes, lightweight ref animation, and static capsules.
- `src/components/world/dialogue/npc-portrait.tsx`, `dialogue-content.tsx`,
  `dialogue-interface.tsx`: original SVG avatars, parchment dialogue, optional
  skippable reveal, native choice/Continue controls, independent close/recovery,
  full accessible text, and preference handling.
- `src/hooks/use-reduced-motion.ts`: shared OS/saved motion preference with
  cleaned-up media subscription.
- `src/components/world/interactions/proximity-prompt.tsx`,
  `interaction-manager.tsx`, `destination-guidance.tsx`: talk prompts, physics
  query bridge, and an actionable clear-directions card.
- `src/components/world/environment/landmark-labels.tsx`, `building-signs.tsx`:
  highlight the selected destination label/ring without particles or teleporting.
- `src/components/world/world-canvas.tsx`, `village-scene.tsx`: NPC/dialogue
  composition, conversation visual frames with paused physics, complete session
  cleanup on world exit/context loss, and scene focus restoration.
- `src/systems/player/camera.ts`, `src/components/world/player/third-person-camera.tsx`:
  closer-side framing, gentle interpolation, unchanged orbit preferences, and
  collision sweeps that ignore the focus NPC while continuing to block walls.
- `src/systems/player/input.ts`: updated accessible controls description; input
  repeat/menu/focus behavior remains shared with the existing player bindings.
- `src/components/ui/modal.tsx`: prevent close cleanup from stealing focus from
  a newly opened portfolio dialog during a handoff.
- `src/types/portfolio.ts`, `src/data/portfolio.ts`,
  `src/components/portfolio/contact-resources.tsx`,
  `src/components/world/interactions/building-panel-manager.tsx`,
  `src/app/portfolio/page.tsx`: typed approved-contact/CV slots and shared HTML
  rendering, with explicit unavailable states and no fabricated links/files.
- `src/app/world/page.tsx`, `globals.css`: current chapter/instructions,
  responsive parchment dialogue, portraits, guidance, and contact resource styles.
- `tests/dialogue.test.ts`, `tests/player.test.ts`, `tests/interactions.test.ts`,
  `package.json`: new dialogue/NPC/camera suite, dialogue input guards, building
  regression isolation, and the `test:dialogue` script in the aggregate test run.
- `README.md`, `public/assets/README.md`, this document: architecture, authoring,
  controls, original asset/replacement policy, verification and limits.

## Implementation decisions

The shared manager compares the nearest reachable NPC and entrance, selecting
one target. Exact ties favor the existing building interaction. Both use a fresh
geometry check when E or a prompt requests interaction. NPC talk rays exclude the
resident and addressed NPC, but still respect walls, props, and other villagers.
Static capsules provide person-sized obstacles. Tests check actual configured
placements/approaches against the village's Rapier colliders.

Appearance references such as `procedural:elder` identify local implementations,
not imaginary model URLs. Alden has a cloak, white beard and staff; Elara has guild
colors, braid, ledger and brooch; Borin has an apron and work hammer; Lyra has
glasses, books and a scroll; Rowan has a cap, badge and keys. Geometry/materials
are shared, owned, and disposed by the NPC collection. No skeletal rig is required.

Dialogue is local typed data, separate from both rendering and the pure engine.
Actions open panels, highlight destinations, complete an objective, close, or
branch. Choices/Continue are explicit transitions; only automatic branches are
resolved internally, with cycle detection and a 32-step bound. The validation
suite checks references/speakers/actions/exits and traverses every published node
and choice. “Another question” returns are deliberate manual loops; Close/Escape
remains independent. Missing records have a visible, closeable recovery state.

The native dialog contains focus. Text reveal is optional and skippable, and
choices can be selected immediately. Screen readers receive the full text once
per node while visual characters are aria-hidden. Reduced motion skips reveal,
decorative gestures, and the conversation camera transition. Typewriter state is
local HTML UI state on a short interval; NPC/player/frame math never sets React
state every frame. Transient stores publish target/location changes, not positions.

The camera selects the nearer side of the pair, limiting its desired turn to
90 degrees, then interpolates. The addressed NPC is excluded from its sphere
sweeps so a close conversation target does not collapse the camera. Other solid
geometry remains active in the sweeps. Orbit preferences and resident coordinates
are retained. On close, normal follow resumes smoothly. Panel handoff keeps the
blocking pause active throughout, and modal cleanup respects the next dialog.

Directions provide a name, readable route, highlighted label/ring, and a clear
button. They never move the player. A single session-only objective records meeting
Alden, with visible feedback. This is an action hook, not a full quest/reward log.

Rowan's contact panel and `/portfolio` share the same resource rendering. No
verified email/social links or approved CV file have been supplied, so those slots
are explicitly unavailable. There is no placeholder download button or fabricated
document. The data/component supports real resources after they are supplied.
Elara identifies the guild's existing decorative board and explains that Projects
currently opens through the panel rather than claiming a separate board mechanic.

## Dependencies

None installed or upgraded. The lockfile, pinned runtime versions, and existing
toolchain remain unchanged. No LLM, paid API, service, database, font download,
external asset pack, or invented GLB/CV path was introduced.

## Verification

| Check | Result |
| --- | --- |
| `npm test` | Passed: 36 tests (4 world, 11 player, 8 interaction, 13 dialogue/NPC) |
| `npm run lint` | Passed without warnings |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; `/`, `/world`, `/portfolio` prerendered |
| `npm run dev` | Started successfully on port 3000, then stopped after checking startup |
| Static HTML portfolio artifact | Includes section anchors and honest social/CV unavailable text |
| Visual/native-dialog browser interaction | Not run; prior localhost origin approval was declined |

The new suite checks all five unique configurations, all nodes/choices and graph
references, branching/Continue/close, destination/objective effects, broken nodes
and automatic loops, actual collider placement/visibility/self-exclusion, other
NPC occlusion, range/floor/nearest-target arbitration, all five conversation close
lifecycles, cooldown/repeat rejection, portfolio handoffs that keep physics paused,
coordinate preservation, idempotent objective completion, pause/focus/settings
guards, unavailable resources, nearest-side camera geometry, close-camera wall
protection, and a fault-injected unavailable panel handoff. Existing suites remain
passing. The input harness explicitly checks the new dialogue blocking state.

## Errors, limits, and acceptance

- An initial lint pass rejected direct mutation of memoized Three vector fields.
  The update now uses the existing vector methods; lint passes without disabling
  the rule. An initial test typecheck needed narrowing of persisted state before
  inspecting keys; this was corrected and typechecking now passes.
- Existing nonfatal Rapier initialization and Three CJS deprecation warnings
  remain in Node tests. They are not suppressed. Dependency audit status was not
  rechecked because this phase installs/upgrades no dependencies.
- Localhost browser access was previously declined by the origin approval gate.
  That request was not repeated or bypassed in this phase. Visual model identity,
  gesture appearance, comfortable framing in every corner, portrait/text layout,
  typewriter skip behavior, native dialog focus/handoff, keyboard/mouse operation,
  touch controls, screen-reader announcements, and console state are **not
  browser-verified**. Automated state tests are not a substitute for these checks.
- Social profile opening and CV downloading cannot be exercised with real
  resources until approved links and an actual CV are supplied. No content was
  fabricated to satisfy those purposes. Portfolio categories/history remain
  explicit empty states.
- This phase has no live asset loader/mixer, voice audio, full interiors, pathfinding,
  fast travel, complete quest system, GPU benchmark, production browser pass,
  device audit, or deployment. Optional waving/gestures are procedural visual
  states; talking is not lip-synced to audio.
- The core requested architecture, five NPCs, authored conversations, actions,
  pause/handoff/close controls, and direction/objective hooks are implemented and
  automated checks pass. **Full phase acceptance is pending browser verification**
  of appearance, mouse/keyboard interactions, and native dialog/camera behavior.

## Manual testing

1. Run `npm run dev` and visit `/world`. Focus the scene near Alden by the well.
   Verify his cloak, white beard and staff; the prompt should name him and read
   “Press E to Talk.” Walk away to remove it, then return and press E.
2. Try Alden's controls branch and Continue, destination submenu, and optional
   stroll. Confirm choices change the text, “Show all text” skips revealing,
   and meeting Alden is recorded once. Close/Escape must always remain available.
3. Ask for each destination. Read its directions and confirm the name/card and
   gold label/ring highlight. Close without teleporting, walk the indicated road,
   and use Clear directions. Repeat for another landmark.
4. Meet Elara, Borin, Lyra and Rowan. Inspect their distinct costumes/portraits,
   idle motion, facing, and gestures. In each conversation choose its Open action:
   guild → Projects, forge → Skills, library → Experience/Education/Certifications,
   gate → Contact. Close the portfolio panel and resume with a fresh movement key.
5. Before talking, enable Debug and note position. Start while moving; movement
   must stop. Hold WASD/E while reading; coordinates must remain fixed and closing
   must not reopen dialogue. Try Settings/form input, pause, blur, and return.
   Recheck building entrances when a nearby NPC competes for the nearest prompt.
6. Approach an NPC very closely and from both sides. Camera motion should be
   smooth and preserve walls; closing should return toward the previous follow
   orbit. Check tight corners explicitly. Reduced motion should keep the camera
   still and show complete text immediately.
7. Use Tab/Shift+Tab and Enter/Space for every choice/Continue/Close control,
   then Escape. Check focus containment, restored scene focus, and the dialogue
   to portfolio handoff. Test mouse activation and 390px/touch layout separately.
8. Ask Rowan about contact/social/CV. Verify clear unavailable states and no fake
   links/download, both in his panel and on the independent `/portfolio` page.
   Check the latter with WebGL/JavaScript unavailable. Test a real download only
   after adding an actual approved file and its matching data entry.
9. Inspect browser console, screen-reader announcements, and reduced motion.
   Run tests, lint, typecheck, and build sequentially before approving the phase.
