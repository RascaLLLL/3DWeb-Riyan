"use client";

import { useEffect, useMemo } from "react";
import { BoxGeometry, CanvasTexture, MeshStandardMaterial, PlaneGeometry, RingGeometry, SRGBColorSpace } from "three";
import { buildingInteractables, buildingPresentations } from "@/data/building-interactions";
import { localToWorld } from "@/data/world";
import { useInteractionStore } from "@/stores/interaction-store";
import type { BuildingId } from "@/types/world";
import { useWalkingDestination } from "@/hooks/use-walking-destination";

function paintedSign(id: BuildingId) {
  const canvas = document.createElement("canvas");
  canvas.width = 768; canvas.height = 256;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#67452b"; context.fillRect(0, 0, 768, 256);
    context.strokeStyle = "#b79a62"; context.lineWidth = 3; context.strokeRect(15, 15, 738, 226);
    context.fillStyle = "#f3e5bd"; context.textAlign = "center";
    const sign = buildingPresentations[id];
    let size = 54;
    do { context.font = `${size--}px Georgia, serif`; } while (context.measureText(sign.signTitle).width > 690);
    context.fillText(sign.signTitle, 384, 112);
    context.font = "30px Georgia, serif";
    const subtitle = id === "library" ? "EXPERIENCE & EDUCATION" : sign.purpose.toUpperCase();
    context.fillText(subtitle, 384, 177, 670);
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
  return { texture, material: new MeshStandardMaterial({ map: texture, roughness: 1 }) };
}

/** Original painted canvas textures, shared geometry, no downloaded fonts or models. */
export function BuildingSigns() {
  const nearby = useInteractionStore((state) => state.nearbyId);
  const destination = useWalkingDestination();
  const resources = useMemo(() => ({
    box: new BoxGeometry(1, 1, 1), plane: new PlaneGeometry(2.4, .8), ring: new RingGeometry(.43, .49, 24),
    wood: new MeshStandardMaterial({ color: "#63472f", roughness: 1 }),
    marker: new MeshStandardMaterial({ color: "#a68b51", roughness: 1 }),
    activeMarker: new MeshStandardMaterial({ color: "#e4c479", roughness: 1 }),
    signs: Object.fromEntries(buildingInteractables.map(({ id }) => [id, paintedSign(id)])) as Record<BuildingId, ReturnType<typeof paintedSign>>,
  }), []);
  useEffect(() => () => {
    resources.box.dispose(); resources.plane.dispose(); resources.ring.dispose();
    resources.wood.dispose(); resources.marker.dispose(); resources.activeMarker.dispose();
    Object.values(resources.signs).forEach(({ material, texture }) => { material.dispose(); texture.dispose(); });
  }, [resources]);
  return <group dispose={null}>{buildingInteractables.map(({ id, building }) => {
    const signPosition = localToWorld([2.1, 0, building.size[2] / 2 + 2], building.position, building.rotation);
    const [x, y, z] = building.interactionAnchor.position;
    const sign = resources.signs[id];
    return <group key={id}>
      <group position={signPosition} rotation={[0, building.rotation, 0]}>
        <mesh geometry={resources.box} material={resources.wood} position={[0, 1.2, 0]} scale={[.12, 2.4, .12]} castShadow />
        <mesh geometry={resources.box} material={resources.wood} position={[0, 2.1, 0]} scale={[2.4, .8, .14]} castShadow />
        <mesh position={[0, 2.1, .075]} geometry={resources.plane} material={sign.material} />
        <mesh position={[0, 2.1, -.075]} rotation={[0, Math.PI, 0]} geometry={resources.plane} material={sign.material} />
      </group>
      <mesh position={[x, y + .18, z]} rotation={[-Math.PI / 2, 0, 0]} geometry={resources.ring}
        scale={destination === id ? 1.5 : 1} material={nearby === id || destination === id ? resources.activeMarker : resources.marker} />
    </group>;
  })}</group>;
}
