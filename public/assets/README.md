# Asset policy

Phases 01–05 use original code-authored SVG artwork and procedural Three.js geometry.
No external models, images, fonts, audio, or proprietary assets are required.

Phase 08 adds locally bundled Cinzel and Source Sans 3 WOFF2 fonts under the SIL
Open Font License 1.1. Sources, copyright notices, file hashes, and unchanged
license texts are in [fonts/README.md](fonts/README.md). They need no external
requests at build or runtime. Interface icons are original inline SVG paths;
the menu illustration and procedural 3D assets remain unchanged.

Phase 06 adds five first-party portfolio PNGs in `portfolio/`: the owner's
published portrait and four project captures. They were migrated from the
owner-identified portfolio at the user's direction, not under an invented asset
pack license. Sources, dimensions, hashes, permission basis, and exclusions are
documented in `docs/portfolio-source-audit.md`. The existing IoT stock illustration
was not copied or represented as a real project capture. Original source files
remain unchanged; Next Image handles responsive delivery. Textual portfolio
content stays usable if any optional image fails. No external 3D asset was added.

Phase 04 entrance signs in `building-signs.tsx` use five original 768 × 256
canvas-painted textures with system Georgia/serif text. No font file or external
texture is downloaded or redistributed. Sign geometry/materials are shared and
disposed with the scene. A future verified sign/model replacement must retain
the ID, purpose, readable label, and anchor from the interaction/world data.

Phase 05's five villagers in `src/components/world/npcs/` use original shared
Three.js geometry and role-specific costumes: Alden's cloak/staff/white beard,
Elara's braid/ledger/brooch, Borin's apron/work hammer, Lyra's glasses/books/scroll,
and Rowan's cap/keys. Their portraits are original inline SVGs in
`src/components/world/dialogue/npc-portrait.tsx`. No external assets were introduced.
`procedural:*` appearance references are configuration IDs, not downloadable URLs.

For a future NPC GLB, verify its actual license/files before extending the
appearance reference type. Keep the stable NPC ID, collider, world placement,
dialogue tree, and interaction range. Use a feet origin at Y=0 facing +Z and map
idle/talking/turning/wave clips behind the visual boundary. Preserve the procedural
visual on optional loading failure. No GLB loader/clip is claimed active today.

No CV has been supplied. Do not generate a fictional CV or set an asset path
until the approved document actually exists in `public/assets/`.

For future GLB assets, record source URL, author, license, attribution requirements,
and modifications here before use. Verify redistribution and deployment rights.
Use Blender-compatible `.glb` files in `public/assets/models/` when introduced.
Replace appropriate builders in `src/systems/world/buildings.ts`, `props.ts`,
or `landscape.ts` with separate asset components when a verified model is
introduced. Keep identity, transforms, interaction anchors, road connections,
and collision metadata in `src/data/world.ts`. Preserve the procedural model
as the fallback when loading fails. Do not assume future filenames or downloads
already exist.

The Phase 02 terrain, house parts, landmark architecture, plants, stonework,
and market props are created directly from Three.js geometry. The palette is
defined in `src/components/world/environment/scene-resources.ts`. They require
no third-party asset attribution and use no external textures. Existing package
licenses are retained in npm dependencies; no external asset pack is bundled.

## Resident visual

The Phase 03 resident in `src/components/world/player/civilian-character.tsx`
is original procedural geometry with articulated arms/legs, a beige tunic,
belt, boots, and satchel. It uses no external textures or models.

Kenney's [Mini Characters](https://kenney.nl/assets/mini-characters) was inspected
as a candidate. The official download's License.txt confirms CC0, and its GLBs
include animation clips; the provided designs use modern outfits/accessories,
so none was adopted for the requested medieval civilian. The inspected download
is not part of this project. This is a suitability decision, not a claim that
licensed animated models do not exist.

For a future replacement, verify the actual GLB and texture licenses, record
source and modifications here, normalize its feet to local Y=0 and face to +Z,
and keep its visual height near 1.9 world units. Clone the skeleton per instance,
map the runtime animation contract to verified clips, use Three.AnimationMixer
with crossfades, and pause the mixer when the movement state is paused. A turning
clip may blend over walking if available. Preserve the procedural visual and
current capsule/controller when optional loading fails. Do not introduce a GLB
URL until its actual files have been added and verified.
