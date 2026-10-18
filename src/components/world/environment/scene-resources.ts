import { BoxGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry, ExtrudeGeometry, IcosahedronGeometry, MeshStandardMaterial, Shape, TorusGeometry, type BufferGeometry } from "three";
import type { GeometryId, MaterialId } from "@/types/world";

const colors: Record<MaterialId, string> = {
  grass: "#7d9859", grassLight: "#8fa96a", grassDark: "#70894e", earth: "#80664b",
  path: "#b6a17a", cobble: "#afa891", cobbleLight: "#c4baa0",
  stone: "#8b9284", stoneLight: "#b0b4a1", plaster: "#e2d3b0",
  timber: "#4c3b2c", wood: "#80603e", woodLight: "#b49462",
  terracotta: "#a45c40", sageRoof: "#6b7851", slate: "#566d74", darkRoof: "#554f47",
  glass: "#415e59", iron: "#444b47", leaf: "#557847", leafLight: "#8aa05a", pine: "#3e654a",
  hay: "#c1a45b", canvas: "#e5d5ab", greenCanvas: "#687c4e", water: "#658f91",
  lantern: "#ebbd66", flower: "#b8797a", flowerGold: "#e1c979", ridge: "#84917b",
};

export function createSceneResources() {
  const shape = new Shape();
  shape.moveTo(-.5, 0); shape.lineTo(.5, 0); shape.lineTo(0, 1); shape.closePath();
  const roof = new ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
  roof.translate(0, 0, -.5);
  const geometries: Record<GeometryId, BufferGeometry> = {
    box: new BoxGeometry(1, 1, 1), cylinder: new CylinderGeometry(1, 1, 1, 12),
    cone: new ConeGeometry(1, 1, 8), sphere: new IcosahedronGeometry(1, 0),
    rock: new DodecahedronGeometry(1, 0), roof, torus: new TorusGeometry(1, .065, 4, 12),
  };
  const materials = Object.fromEntries(Object.entries(colors).map(([id, color]) => [id,
    new MeshStandardMaterial({ color, roughness: id === "water" ? .45 : 1, flatShading: true,
      ...(id === "lantern" ? { emissive: color, emissiveIntensity: .35 } : {}) }),
  ])) as Record<MaterialId, MeshStandardMaterial>;
  return {
    geometries, materials,
    dispose() { Object.values(geometries).forEach((g) => g.dispose()); Object.values(materials).forEach((m) => m.dispose()); },
  };
}
