import { BoxGeometry, ConeGeometry, CylinderGeometry, IcosahedronGeometry, MeshStandardMaterial, TorusGeometry } from "three";
import { npcs } from "@/data/npcs";
import type { NpcId } from "@/types/npc";

const material = (color: string) => new MeshStandardMaterial({ color, roughness: 1, flatShading: true });
export function createNpcResources() {
  const geometry = {
    box: new BoxGeometry(1, 1, 1), round: new IcosahedronGeometry(1, 0),
    cylinder: new CylinderGeometry(1, 1, 1, 6), tunic: new CylinderGeometry(.72, 1, 1, 6),
    cone: new ConeGeometry(1, 1, 6), ring: new TorusGeometry(.1, .014, 4, 12),
    cloak: new CylinderGeometry(.31, .49, 1.1, 8, 1, false, Math.PI / 2, Math.PI),
  };
  const shared = { leather: material("#5a3e2b"), wood: material("#846139"), dark: material("#30362e"),
    pages: material("#e7d7ac"), metal: material("#727c79"), gold: material("#b29a58"), book: material("#864b42") };
  const palettes = Object.fromEntries(npcs.map((npc) => [npc.id, {
    tunic: material(npc.appearance.tunic), accent: material(npc.appearance.accent),
    skin: material(npc.appearance.skin), hair: material(npc.appearance.hair),
  }])) as Record<NpcId, { tunic: MeshStandardMaterial; accent: MeshStandardMaterial; skin: MeshStandardMaterial; hair: MeshStandardMaterial }>;
  return { geometry, shared, palettes, dispose() {
    Object.values(geometry).forEach((item) => item.dispose());
    Object.values(shared).forEach((item) => item.dispose());
    Object.values(palettes).forEach((palette) => Object.values(palette).forEach((item) => item.dispose()));
  } };
}
export type NpcResources = ReturnType<typeof createNpcResources>;
