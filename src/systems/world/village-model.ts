import { worldConfig } from "@/data/world";
import { buildHouse } from "./buildings";
import { buildLandscapeDetails, buildNature, buildPaths, createNaturePlacements, createStaticObstacles } from "./landscape";
import { PartBuilder } from "./part-builder";
import { buildProp } from "./props";

/** Deterministic static model. No per-frame allocations or physics initialization. */
export function createVillageModel() {
  const builder = new PartBuilder();
  builder.parts.push(...buildPaths(), ...buildLandscapeDetails());
  for (const building of worldConfig.buildings) builder.place(buildHouse(building), building.position, building.rotation);
  for (const prop of worldConfig.props) builder.place(buildProp(prop.kind, prop.variant), prop.position, prop.rotation);
  const nature = createNaturePlacements();
  builder.parts.push(...buildNature(nature));
  return { parts: builder.parts, nature, obstacles: createStaticObstacles(nature) };
}
