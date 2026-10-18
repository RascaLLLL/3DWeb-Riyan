"use client";

import { useMemo, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { worldConfig } from "@/data/world";
import { useGuidanceStore } from "@/stores/guidance-store";

export type LandmarkRefs = RefObject<(HTMLSpanElement | null)[]>;

/** HTML lives in the page's React root, outside the Three renderer. */
export function LandmarkLabels({ labels }: { labels: LandmarkRefs }) {
  const destination = useGuidanceStore((state) => state.destination);
  return <div className="landmark-overlay" aria-hidden="true">{worldConfig.buildings.map((building, index) =>
    <span key={building.id} className={`scene-landmark ${destination === building.id ? "is-guided" : ""}`} ref={(element) => { labels.current[index] = element; }}>
      <span>{String(index + 1).padStart(2, "0")}</span>{building.name}
    </span>,
  )}</div>;
}

/** Project five labels on demand-rendered frames; reuse the vector, no React state. */
export function LandmarkProjection({ labels }: { labels: LandmarkRefs }) {
  const point = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size }) => {
    worldConfig.buildings.forEach((building, index) => {
      const element = labels.current[index];
      if (!element) return;
      const height = building.id === "gate" ? 10.7 : building.id === "library" ? 12.2 : building.size[1] + 4.5;
      point.set(building.position[0], height, building.position[2]).project(camera);
      const visible = point.z >= -1 && point.z <= 1 && Math.abs(point.x) < 1.15 && Math.abs(point.y) < 1.1;
      element.style.visibility = visible ? "visible" : "hidden";
      element.style.transform = `translate(-50%, -50%) translate(${(point.x * .5 + .5) * size.width}px, ${(-point.y * .5 + .5) * size.height}px)`;
    });
  });
  return null;
}
