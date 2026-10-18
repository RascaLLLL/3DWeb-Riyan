# The Village of Riyan — Project Instructions

## Purpose and vision

Build a real personal developer portfolio as a fully interactive, cozy,
stylized, low-poly medieval fantasy village. Visitors explore as regular
village residents through a premium, RPG-inspired experience.

This is not a combat game, MMORPG, or generic landing page with a decorative
3D background. Portfolio information and usable exploration take priority
over visual effects.

## Scope and phase discipline

- Work only on the feature requested in the current development phase.
- Do not implement unrelated future phases or the full game ahead of scope.
- Prioritize a functional MVP before advanced visual effects.
- Inspect the repository and applicable instructions before changing files.
- Preserve existing work, architecture, and conventions; do not rewrite
  unrelated files.
- Create reusable abstractions when justified, without premature complexity.
- Never silently replace intended interactive mechanics with decorative mockups.

The initial phase is repository inspection and creation or updating of this
file only. Application scaffolding and gameplay require a subsequent request.
At initial inspection, the workspace was empty and was not a Git repository.

## Intended experience

These are product requirements to implement in their requested phases, not
authorization to implement them all immediately:

- Third-person exploration with a playable civilian character.
- A medieval village with interactive NPCs, dialogue choices, buildings,
  and objects.
- Real developer projects discovered through a guild quest board.
- Skills presented through a blacksmith.
- Professional experience and education presented through a library.
- Contact information available at the village gate.
- Optional exploration quests without combat, grinding, XP, or leveling.
- Quick Portfolio mode for recruiters and visitors who prefer direct access.

## Technology stack

- Next.js App Router, React, and TypeScript with strict mode.
- Tailwind CSS for styling.
- Three.js, `@react-three/fiber`, and `@react-three/drei` for 3D rendering.
- `@react-three/rapier` for physics when needed by the requested phase.
- Zustand for shared client state.
- Blender-compatible GLB assets.
- Local TypeScript or JSON portfolio content.
- LocalStorage for preferences and exploration progress.
- Vercel-compatible deployment.

Install dependencies only when needed for the current phase. Do not introduce
database dependencies, paid APIs, paywalled services, unnecessary third-party
APIs, or proprietary asset dependencies.

## Architecture and implementation

- Keep components modular and reusable; avoid massive monolithic components.
- Separate 3D scene logic from HTML interface logic.
- Separate portfolio content from UI implementation.
- Use TypeScript types and interfaces for content, state, and interaction
  contracts; maintain strict type checking.
- Support desktop and mobile progressively.
- Keep browser-only APIs, rendering, and persistence within appropriate client
  boundaries so the application remains compatible with Next.js and Vercel.
- Keep the application functional without optional assets.
- Maintain accessibility and a non-3D portfolio fallback. All important
  portfolio content must be accessible outside the 3D canvas.
- Ensure HTML interactions support appropriate semantics, keyboard operation,
  and visible focus. Do not make essential information depend on navigating
  the 3D world.
- Avoid unnecessary React render cycles and per-frame React state updates.
- Avoid creating expensive objects inside `useFrame`; reuse objects and
  resources where practical.
- Use performant Three.js practices, including sensible geometry, material,
  lighting, and shadow budgets and appropriate resource cleanup.
- Never expose placeholder buttons that appear functional. Implement their
  action or clearly communicate that the action is unavailable.

## Visual and interaction direction

- Cozy medieval fantasy with stylized low-poly geometry.
- Warm sunlight, forest-green surroundings, and subtle fantasy atmosphere.
- Wooden and stone architecture, cobblestone roads, and medieval marketplace
  decorations.
- Parchment-inspired interfaces with muted gold accents.
- Tasteful animation and premium indie-game presentation.

Avoid generic SaaS dashboards, cyberpunk aesthetics, pervasive glassmorphism,
purple neon gradients, excessive bloom, excessive particles, and emoji-based
navigation. Do not add combat, inventory grinding, XP, or leveling systems.

## Content integrity and assets

- Never invent actual work experience, projects, achievements, links,
  education, or credentials.
- Use user-provided or verified portfolio information. If required information
  is missing, make that absence clear and request it when needed; do not present
  fictional content as real accomplishments.
- Use only assets with verified compatible licenses. Document their source,
  license, and any required attribution when introducing them.
- Never fabricate downloadable GLB models or claim nonexistent assets exist.
- If suitable external 3D assets are unavailable, use high-quality procedural
  low-poly placeholder geometry and document the replacement path.
- Optional asset failures must not prevent access to portfolio content.

## Verification and phase completion

After every phase:

1. Summarize the modified files.
2. Explain implementation decisions and their relation to the requested scope.
3. List installed dependencies, or explicitly state that none were installed.
4. Run available verification commands appropriate to the changes. Inspect
   existing scripts before selecting commands; do not invent successful checks.
5. Report errors, unrun checks, and limitations honestly. Never claim untested
   features are working.
6. Provide clear manual testing instructions for the delivered phase.
7. State whether the phase acceptance criteria are met. If criteria are not
   explicit, assess the requested deliverable and clearly identify any gaps.

For documentation-only phases without an application or verification scripts,
verify the file contents and scope and report that application checks are not
available. For implementation phases, run relevant available type, lint, test,
and build checks and verify interactions appropriate to the change.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
