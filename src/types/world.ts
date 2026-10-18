export type Vec3 = [number, number, number];
export type Vec2 = [number, number];
export type BuildingId = "cottage" | "guild" | "forge" | "library" | "gate";
export type PortfolioSectionId = "about" | "projects" | "skills" | "experience" | "education" | "certifications" | "contact";

export interface StaticObstacle {
  id: string;
  center: Vec3;
  halfExtents: Vec3;
  rotation: number;
  kind: "building" | "prop" | "nature" | "boundary";
}

export interface BuildingDefinition {
  id: BuildingId;
  name: string;
  position: Vec3;
  rotation: number;
  size: Vec3;
  roof: "terracotta" | "sageRoof" | "slate" | "darkRoof";
  interactionAnchor: { position: Vec3; radius: number };
  collisions: StaticObstacle[];
  portfolioSections: PortfolioSectionId[];
  portfolioHref: string;
  description: string;
}

export interface RoadDefinition {
  id: string;
  destination: BuildingId;
  points: Vec2[];
  width: number;
  surface: "cobblestone" | "dirt";
}

export type PropKind = "well" | "noticeBoard" | "bench" | "lantern" | "stall" | "barrel" | "crate" | "hay" | "cart" | "fence";
export interface PropDefinition {
  id: string;
  kind: PropKind;
  position: Vec3;
  rotation: number;
  variant?: number;
}

export interface NaturePlacement {
  id: string;
  kind: "pine" | "oak" | "bush" | "rock" | "flowers";
  position: Vec3;
  scale: number;
  rotation: number;
}

export type GeometryId = "box" | "cylinder" | "cone" | "sphere" | "rock" | "roof" | "torus";
export type MaterialId = "grass" | "grassLight" | "grassDark" | "earth" | "path" | "cobble" | "cobbleLight" | "stone" | "stoneLight" | "plaster" | "timber" | "wood" | "woodLight" | "terracotta" | "sageRoof" | "slate" | "darkRoof" | "glass" | "iron" | "leaf" | "leafLight" | "pine" | "hay" | "canvas" | "greenCanvas" | "water" | "lantern" | "flower" | "flowerGold" | "ridge";

export interface ScenePart {
  geometry: GeometryId;
  material: MaterialId;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
}
