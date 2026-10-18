# Asset policy

Phase 01 uses original code-authored SVG artwork and procedural Three.js geometry.
No external models, images, fonts, audio, or proprietary assets are required.

For future GLB assets, record source URL, author, license, attribution requirements,
and modifications here before use. Verify redistribution and deployment rights.
Use Blender-compatible `.glb` files in `public/assets/models/` when introduced.
Replace the marker group in `src/components/world/foundation-scene.tsx` with a
separate model component at that phase; retain procedural fallback geometry when
loading fails. Do not assume future filenames or downloads already exist.
