"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Euler, InstancedMesh, Matrix4, Quaternion, Vector3, type BufferGeometry, type Material } from "three";
import type { ScenePart } from "@/types/world";
import { createSceneResources } from "./scene-resources";

function InstanceBatch({ parts, geometry, material, shadows }: { parts: ScenePart[]; geometry: BufferGeometry; material: Material; shadows: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const matrix = new Matrix4(), position = new Vector3(), rotation = new Euler(), quaternion = new Quaternion(), scale = new Vector3();
    parts.forEach((part, index) => {
      position.set(...part.position); rotation.set(...part.rotation); scale.set(...part.scale);
      quaternion.setFromEuler(rotation);
      mesh.current!.setMatrixAt(index, matrix.compose(position, quaternion, scale));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
    const instance = mesh.current;
    invalidate();
    // Shared geometry/materials have a separate owner; release instance buffers here.
    return () => instance.dispose();
  }, [parts, invalidate]);
  return <instancedMesh ref={mesh} args={[geometry, material, parts.length]} castShadow={shadows} receiveShadow dispose={null} />;
}

export function StaticInstances({ parts, shadows }: { parts: ScenePart[]; shadows: boolean }) {
  const resources = useMemo(() => createSceneResources(), []);
  const batches = useMemo(() => {
    const map = new Map<string, ScenePart[]>();
    for (const part of parts) {
      const key = `${part.geometry}:${part.material}`;
      const batch = map.get(key);
      if (batch) batch.push(part); else map.set(key, [part]);
    }
    return Array.from(map.entries());
  }, [parts]);
  useEffect(() => () => resources.dispose(), [resources]);
  return <group dispose={null}>{batches.map(([key, batch]) => <InstanceBatch key={key} parts={batch}
    geometry={resources.geometries[batch[0].geometry]} material={resources.materials[batch[0].material]}
    shadows={shadows && !["grassLight", "grassDark", "water", "flower", "flowerGold"].includes(batch[0].material)} />)}</group>;
}

