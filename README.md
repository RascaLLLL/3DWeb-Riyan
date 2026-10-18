# The Village of Riyan

A medieval personal portfolio built with Next.js App Router, React, TypeScript,
Tailwind CSS, and React Three Fiber. Phase 01 provides the foundation only.
There are no NPCs, walking mechanics, quests, or actual portfolio entries yet.

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
npm run build      # Production build
npm start          # Serve the production build
```

## Routes

- `/`: responsive main menu, original illustrated concept map, and settings.
- `/world`: client-only WebGL2 canvas with ground, ambient/directional light,
  and procedural resident marker. Drag to orbit, scroll/pinch to zoom. This is
  a rendering preview, not a playable village.
- `/portfolio`: server-rendered HTML portfolio with section navigation;
  independent of WebGL and readable with JavaScript disabled. Explicit empty
  states remain until verified portfolio information is supplied.

## Architecture

```text
src/app/                 App Router pages, global styling, route loading UI
src/components/ui/       Button, Panel, Modal, LoadingIndicator, SectionHeading,
                         MedievalInterface
src/components/menu/     Original SVG concept illustration
src/components/world/    Client loader, error/fallback UI, canvas, basic scene
src/data/                Typed portfolio content, separate from presentation
src/hooks/               Browser capability hooks
src/stores/              Zustand state and persisted preferences
src/systems/             Graphics presets and future game systems
src/types/               Shared content and state contracts
public/assets/           Optional assets and license/replacement documentation
```

The canvas is loaded with `ssr: false` from a client component and only on
`/world`. It renders on demand, caps pixel ratio, and adjusts shadows by quality.
HTML navigation remains available around the scene. WebGL unavailability,
render errors, and context loss expose an HTML fallback link.

Zustand holds `gameStarted`, `gamePaused`, `activePanel`, `graphicsQuality`,
`musicVolume`, `soundEffectsVolume`, and `playerPreferences`. Only quality,
volumes, and player preferences persist under `riyan-village-settings`.
Hydration occurs after mount to avoid server/client markup mismatch. Saved
values are validated. Game/panel state resets when leaving the world. Settings
pause scene controls. Audio values are saved preferences only: audio is not
implemented in this phase.

The native dialog handles modal focus containment and Escape; focus returns to
the trigger. UI respects both OS reduced motion and the saved preference.
The preview has no automatic camera animation. Use keyboard HTML navigation
or Quick Portfolio when pointer-driven orbit controls are unsuitable.

## Dependency compatibility

Runtime versions are pinned: Next 16.4.2, React/React DOM 19.3.1, Three 0.186.1,
Fiber 9.8.2, Drei 10.7.9, Rapier 2.2.0, Zustand 5.0.15. Tailwind/PostCSS plugin
are 4.3.3. These versions were checked against npm peer dependency metadata;
Fiber 9, Drei 10, and Rapier 2 support React 19. Rapier is installed for the
requested foundation but is not imported or initialized until physics is needed.
No external fonts, media, paid services, or databases are required.

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
The map is a concept illustration, not a functioning navigation map. The
resident is procedural placeholder geometry, not a claimed GLB download.
See `public/assets/README.md` for the future model replacement and license policy.

## Planned phases

Only Phase 01 is implemented. Later phases are proposals, subject to explicit scope:

1. Foundation: project setup, menu, settings, routing, HTML fallback, scene test.
2. Exploration: civilian movement, camera, collisions, and progressive controls.
3. Village: modular environment and licensed assets with procedural fallbacks.
4. Interactions: NPCs, dialogue, buildings, and objects.
5. Portfolio integration: guild projects, blacksmith skills, library experience
   and education, gate contact, using approved real content.
6. Optional discovery quests, accessibility polish, performance, deployment QA.

## Vercel

Use the standard Next.js preset and project root. Build with `npm run build`;
let Vercel detect the output directory. No environment variables or backend
services are required. Use a supported Node version meeting the engine floor.
Settings are browser-local, not synchronized between devices. Do not enable
static export without separately checking route and asset requirements.

Next.js appended its standard managed guidance block to `AGENTS.md` on the
first dev run; the existing project instructions are preserved above it.

## Manual verification

1. Open `/` at desktop and 375px mobile widths; check layout and horizontal overflow.
2. Use Tab/Shift+Tab and Enter for menu navigation. Open Settings, change quality
   and volumes, toggle reduced motion, press Escape, and check restored focus.
3. Reload and check saved preferences. Verify a new world session is not paused.
4. Enter `/world`; confirm the ground, marker, lighting, orbit, and zoom. Change
   quality and confirm rendering remains available. No walking is expected yet.
5. Visit `/portfolio` directly with WebGL unavailable and with JavaScript disabled;
   confirm section links and all content remain accessible.
6. Emulate reduced motion; check the loading indicator no longer animates.
7. Check browser console for unexpected errors and run lint, typecheck, and build.
