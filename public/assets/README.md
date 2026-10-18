# Asset policy

Phases 01–03 use original code-authored SVG artwork and procedural Three.js geometry.
No external models, images, fonts, audio, or proprietary assets are required.

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
