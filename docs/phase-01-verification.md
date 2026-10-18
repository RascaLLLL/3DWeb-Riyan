# Phase 01 verification — 18 October 2026

## Delivered

- Next.js App Router and strict TypeScript configuration, Tailwind PostCSS,
  ESLint, npm scripts, lockfile, and the requested source directories.
- Parchment main menu with original SVG concept map, three menu actions,
  route/scene loading states, visible focus, and responsive layout.
- Shared Button/ButtonLink, Panel, Modal, LoadingIndicator, SectionHeading,
  and MedievalInterface components.
- Typed local portfolio content and server-rendered `/portfolio` sections.
- Zustand runtime state with validated, optional settings persistence.
- Client-only `/world` scene, graphics presets, ground, light, procedural
  marker, pointer orbit controls, and HTML failure handling.
- README installation, architecture, manual checks, future phases, deployment
  notes, and asset replacement/license policy.
- Existing AGENTS.md preserved; Next.js appended its standard managed block.

## Checks performed

| Check | Result |
| --- | --- |
| `npm install` | Passed with tooling warnings noted below |
| `npm ls --depth=0` | Passed; no invalid direct dependencies |
| `npm run lint` | Passed without warnings |
| `npm run typecheck` | Passed |
| `npm run build` | Passed with Webpack; all three routes prerendered |
| Development server | Started successfully |
| HTTP `/`, `/world`, `/portfolio` | All returned 200 |
| Desktop browser navigation | All three routes opened |
| Basic 3D scene | Ground, light, and marker visually confirmed |
| Orbit | Pointer drag visibly changed the camera |
| Quality changes | Low → high → medium retained the scene |
| Settings persistence | Graphics/reduced-motion persisted after reload; direct world reload retained quality |
| Keyboard settings | Slider responds to arrow key; Escape closes modal and restores trigger focus |
| Mobile menu | Visually checked at 375 × 812; no horizontal overflow |
| Portfolio independent HTML | Full content present in raw HTTP response without running JavaScript |
| Browser error logs | No errors captured in the exercised flows |
| `npm audit --omit=dev` | Zero vulnerabilities |

## Limitations and fixes

- Turbopack's CSS worker failed on this Windows host, including an elevated
  retry. Scripts use the supported `--webpack` option. Sandbox restrictions
  also required elevated local HTTP checks and production output generation.
- npm reports five related high-severity development-only findings in the
  Next lint configuration's `braces` dependency chain. No patched braces release
  was available. ESLint 9 is marked unsupported, but Next's bundled lint
  plugins reject ESLint 10. These are documented, not suppressed or force-fixed.
- Three emits nonfatal warnings for `THREE.Clock` deprecation and the renderer's
  default `PCFSoftShadowMap` falling back to `PCFShadowMap`. Both originate in
  the rendering stack; shadows render, and no custom frame-loop clock is used.
- Testing found and fixed canvas remounts mistakenly triggering the context-loss
  fallback during quality changes; quality now updates the same canvas and the
  loss listener is cleaned up on unmount.
- Portfolio information is intentionally missing until approved content is
  supplied. No projects, credentials, contact details, or achievements invented.
- Audio is not implemented; controls explicitly save preferences for future use.
- No NPCs, walking, physics simulation, or advanced world features implemented.
- JavaScript-disabled browser mode, forced GPU failure, mobile touch gestures,
  full keyboard traversal, and automated accessibility audits were not exercised.
  The raw-HTML check verifies content delivery but is not a substitute for a
  complete assistive-technology audit.
- Vercel deployment was not requested or performed.

The Phase 01 acceptance criteria are met in the tested local environment,
subject to the tooling warnings and broader testing limits above. Use the
manual verification steps in README.md for additional device/browser testing.
