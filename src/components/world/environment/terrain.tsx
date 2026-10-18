"use client";

import { useEffect, useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, MeshStandardMaterial } from "three";
import type { createTerrainData } from "@/systems/world/terrain-data";


export function Terrain({ data }: { data: ReturnType<typeof createTerrainData> }) {
  const geometry = useMemo(() => { const value = new BufferGeometry(); value.setAttribute("position", new Float32BufferAttribute(data.positions, 3)); value.setAttribute("color", new Float32BufferAttribute(data.colors, 3)); value.computeVertexNormals(); return value; }, [data]);
  const material = useMemo(() => new MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }), []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <mesh geometry={geometry} material={material} receiveShadow dispose={null} />;
}


