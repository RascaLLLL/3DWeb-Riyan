# Phase 06 — Real portfolio content integration

Implemented on **21 October 2026** in `D:\THEVILLAGE`.

## Delivered scope

The existing public portfolio was inspected and corroborated with its linked
public source repository. Real profile information, five projects, listed skills,
three work roles, one education entry, five certificate records, and public
contact channels now populate both the medieval village and Quick Portfolio.

The source of truth is [heyriyan.vercel.app](https://heyriyan.vercel.app/).
Detailed provenance and conflicts are recorded in
[the source audit](portfolio-source-audit.md). The complete manual completion
list is in [missing content](portfolio-missing-content.md).

## Modified files

- `src/types/portfolio.ts`: required typed profile, source, TODO, media, verified
  link, skill/category/icon, project, work, date range, education, certificate,
  and contact contracts. Missing data is null/empty with an explicit TODO.
- `src/data/portfolio.ts`: shared facade and section associations, with project
  lookup. `src/data/portfolio/source.ts`, `profile.ts`, `contact.ts`, `skills.ts`,
  `projects.ts`, `experience.ts`, `education.ts`, `certifications.ts`, and
  `missing-content.ts`: centralized real records, source references, and TODO index.
- `src/systems/portfolio/links.ts`: omit placeholder, unsafe, or unsourced links
  from outbound actions.
- `src/components/portfolio/profile-journal.tsx`: portrait/identity, biography,
  resume access/readiness, and missing profile information.
- `skill-workshop.tsx`, `archive-records.tsx`: grouped skills with Exploring
  labels, work timeline, education, and original certificate titles/issuers.
- `project-board.tsx`, `project-case-study.tsx`: useful project cards and shared
  case studies with screenshot galleries, Challenge, Solution, My contribution,
  Tech stack, Outcome, safe optional actions, and honest gaps/conflicts.
- `portfolio-section-content.tsx`, `content-ui.tsx`, `portfolio-media.tsx`:
  shared section dispatch, TODO/tag/date/icon UI, and optional image failure fallback.
- `contact-resources.tsx`: actual public mailto/social channels and resume
  action readiness, with no invented document or submission API.
- `src/components/world/interactions/guild-project-browser.tsx`: local board/
  case-study selection and return focus within the existing modal. The canvas,
  player position, and pause contract are unchanged.
- `building-panel-manager.tsx`: Cottage journal, interactive Guild notices,
  Forge workshop, Library records, and Gate contact using shared renderers.
- `src/app/portfolio/page.tsx`: complete semantic HTML portfolio, direct section/
  project/contact links, responsive layout, and indexing metadata.
- `src/app/portfolio/projects/[projectId]/page.tsx`: five statically generated
  case-study pages, per-project metadata, and 404 behavior for unknown IDs.
- `src/app/portfolio.css`, `layout.tsx`: modular shared portfolio styles loaded
  for the conventional portfolio and village panels.
- `src/data/dialogues.ts`, `src/app/world/page.tsx`: keep NPC guidance/current
  chapter accurate now that real records exist; remove obsolete empty-content claims.
- `public/assets/portfolio/*.png`: unchanged first-party portrait and four real
  project captures, with verified dimensions/provenance. No IoT stock image.
- `tests/portfolio.test.tsx`, `portfolio-build.test.mjs`, `dialogue.test.ts`,
  `package.json`: nine content/SSR checks, two post-build HTML checks, migrated
  contact fixture, and corresponding test scripts. Lockfile is unchanged.
- `README.md`, `public/assets/README.md`, the source/missing-content documents,
  and this report: current architecture, sources/permission, commands, limitations,
  manual testing, and missing fields. Next regenerated `next-env.d.ts` route-type
  imports through its normal dev/typecheck/build commands; no hand edit was made.

## Decisions and content integrity

The modules are the only portfolio data source. The conventional page and world
reuse the journal, skills, archive, contact, and case-study components. The Guild
adds local selection state, keeping its board and case study in the same modal;
it does not navigate away or unmount the 3D world. Every project also has a direct
static HTML route, so essential information is accessible without exploration,
WebGL, or JavaScript. Portfolio sections use semantic headings/articles/lists and
native links/details. No deployment URL/canonical was invented for the new app.

The five original titles are preserved: Mount Adventure Roblox, Car Evaluation
Classifier, Cybersecurity Learning Platform, IoT Monitoring Dashboard, and Chibii
Snack Website. Published responsibilities and academic focus areas remain intact.
Certificate titles remain in their official source language. Skills have no
proficiency percentages; source-listed exploration is distinguished from other
listed skills. The source's third-party message form and vanity counters were
not migrated.

No original problem context was supplied for the projects. Those fields remain
TODO, rather than inventing clients, constraints, or motivations. Source-described
solutions/contributions and delivered functionality are retained. IoT contribution
is unspecified and remains TODO. Work outcomes have no fabricated statistics.
No location, resume, GPA, graduation date, issue date, or credential URL was inferred.

The classifier's accuracy is explicitly source-reported with missing evaluation
context, not independently validated. Roblox screenshot naming and Chibii's
published stack versus related public source are openly flagged. All original
project actions were `#`, so no fake demo/repository button is present. Certificate
verification actions and resume access appear only after actual verified values
are provided. LinkedIn is associated through the published owner link; its
automated availability block is recorded instead of claiming a successful check.

Five first-party PNGs were migrated unchanged at the owner's direction. Their
sources, dimensions, permission basis, and hashes are documented. The IoT source
uses stock imagery, which is excluded rather than mislabeled as a dashboard
capture. Local images use Next Image's responsive delivery and a text fallback
on failure. All written records remain available if optional images fail.

There is no runtime source-site/GitHub fetch, paid service, new backend, database,
LLM, external font, or new 3D model. Existing player/NPC/interaction mechanics and
their blocking pause behavior are preserved.

## Dependencies

**None installed or upgraded.** Existing pinned versions and `package-lock.json`
remain unchanged. New commands use the existing Node, tsx, React server renderer,
and Next toolchain.

## Verification

| Check | Result |
| --- | --- |
| `npm test` | Passed: 45 tests (4 world, 11 player, 8 interaction, 13 dialogue, 9 portfolio) |
| `npm run test:portfolio` | Passed; real data integrity and shared server-rendered content |
| `npm run lint` | Passed without lint warnings |
| `npm run typecheck` | Passed |
| `npm run build` | Passed outside the sandbox after an EPERM retry; menu, world, portfolio, and five case-study routes generated |
| `npm run test:portfolio:build` | Passed: 2 tests inspecting script-free built HTML |
| `npm run dev` | Started successfully on port 3000, then stopped after startup verification |
| `git diff --check` | Passed; Git reports normal LF/CRLF normalization notices |
| Source media | Five HTTP 200 PNG files, visually inspected; local dimensions verified in tests |
| Browser/mobile visual test | Not run: previous localhost browser origin approval was declined |

The new tests assert exact original project/role identities, unique IDs/source
provenance, complete associations, honest nulls, safe action eligibility, PNG
dimensions, exclusion of stock IoT imagery, source conflict/metric disclosure,
real mailto and public social links, absent fake CV/demo/credential actions,
and server rendering of case studies/skills/archives without 3D. Post-build tests
strip script tags before inspecting all seven section anchors, five direct project
links, static case-study headings/content, contact links, indexing metadata,
and absence of canvas/placeholder actions. These are content/HTML checks, not
automated visual or native-dialog browser tests.

## Errors and limitations

- Source access initially failed in the web reader/sandbox DNS. An approved
  network request resolved access; the application itself has no network dependency
  on that research path. No guessed contact or project detail filled the gap.
- The prior dialogue test expected zero social links. Its fixture was updated
  to the three migrated public links. An initial new SSR assertion accidentally
  matched explanatory text as a fake action; it now checks actual anchor markup.
  Both issues are resolved and the final checks pass.
- A final sandbox build rerun failed creating `.next/server/app/_not-found`
  with EPERM. The prescribed approved rerun outside the sandbox compiled and
  built successfully. No file-permission workaround or deletion was used.
- Existing nonfatal Rapier initialization and Three CJS deprecation warnings
  remain in physics tests. No dependencies were upgraded for unrelated warnings.
- The local browser origin approval was declined earlier. It was not repeated
  or bypassed here. Mobile layout/readability, image optimization in a real browser,
  Guild project selection/back-focus behavior, native modal/keyboard operation,
  contact application launching, console state, and a full accessibility audit
  remain **unverified in a browser**. Responsive CSS and server HTML checks do
  not substitute for that pass. No screenshot of the finished UI is claimed.
- Public source presence verifies what the owner published, not every issuer
  credential or experimental result. Exact dates, CV, project URLs/context,
  credential verification, and the two source conflicts still need completion.
- No actual message was sent, no CV file fabricated, no third-party form API
  introduced, and no Vercel deployment or production browser test performed.

## Acceptance assessment

- **Centralized, strongly typed data:** met.
- **Same information in world and Quick Portfolio:** met by shared records and renderers.
- **Useful project cards and case studies:** implemented and server-render tested.
- **Missing links do not masquerade as working buttons:** met in data, renderer,
  and built-HTML tests. Published LinkedIn association carries its availability caveat.
- **Every important section outside exploration:** met in script-free built HTML,
  with seven sections and five direct case-study pages.
- **No fabricated real personal information:** met; source audit and TODOs document
  the boundaries.
- **Small-screen readability and interactive browser presentation:** designed
  progressively, but full acceptance remains pending the browser/manual pass.

## Manual testing

1. Run `npm run dev`. Open `/portfolio` at desktop and 390px widths, then with
   JavaScript/WebGL unavailable. Check all seven sections, no horizontal overflow,
   readable dates/skills/long certificate titles, and native TODO details.
2. Open each project card. Check the actual source image, complete gallery,
   Challenge/Solution/Contribution/Tech stack/Outcome sections, honest TODOs,
   source-reported classifier result, and Roblox/Chibii conflict notes. IoT must
   show a genuine-screenshot TODO rather than stock imagery. Direct-route reload
   should work; an unknown project ID should return 404.
3. Check the email link uses `mailto:hpitono24@gmail.com`; open the published
   social profiles. LinkedIn may require normal browser access/login. Verify no
   resume, demo, repository, or credential action exists for missing data.
4. Enter `/world`. Open the Cottage journal, Forge skills, Library archives,
   and Gate contact. Compare them with the same HTML records. Talk to each keeper;
   their guidance should no longer claim all portfolio content is absent.
5. At the Guild, select all five quest-board notices, read their case studies,
   and use Back. Check focus reaches the record/returns to its notice, the scene
   stays mounted and paused, and closing restores exploration with unchanged
   position. Repeat with Tab/Enter/Space/Escape, reduced motion, and touch width.
6. Temporarily block one optional image in developer tools; written records
   must remain readable. Check browser console and focus/contrast/zoom behavior.
7. Run tests, lint, typecheck, and build sequentially, followed by
   `npm run test:portfolio:build`. Use the missing-content list for later updates.
