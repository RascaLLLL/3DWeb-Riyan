import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import type { GeometryId, MaterialId, ScenePart, Vec3 } from "@/types/world";

/** Builders emit static instance data in a local frame, never React meshes. */
export class PartBuilder {
  readonly parts: ScenePart[] = [];

  add(geometry: GeometryId, material: MaterialId, position: Vec3, scale: Vec3, rotation: Vec3 = [0, 0, 0]) {
    this.parts.push({ geometry, material, position, scale, rotation });
  }

  box(material: MaterialId, position: Vec3, scale: Vec3, rotation: Vec3 = [0, 0, 0]) {
    this.add("box", material, position, scale, rotation);
  }

  // Beam between any two local points. Allocations happen once at scene creation.
  beam(material: MaterialId, from: Vec3, to: Vec3, thickness: number) {
    const start = new Vector3(...from), end = new Vector3(...to);
    const direction = end.clone().sub(start);
    const rotation = new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize()));
    this.box(material, start.add(end).multiplyScalar(.5).toArray() as Vec3, [thickness, direction.length(), thickness], [rotation.x, rotation.y, rotation.z]);
  }

  place(parts: ScenePart[], origin: Vec3, yaw = 0) {
    const parent = new Matrix4().compose(new Vector3(...origin), new Quaternion().setFromEuler(new Euler(0, yaw, 0)), new Vector3(1, 1, 1));
    const matrix = new Matrix4(), position = new Vector3(), quaternion = new Quaternion(), scale = new Vector3(), rotation = new Euler();
    for (const part of parts) {
      matrix.compose(new Vector3(...part.position), new Quaternion().setFromEuler(new Euler(...part.rotation)), new Vector3(...part.scale));
      matrix.premultiply(parent).decompose(position, quaternion, scale);
      rotation.setFromQuaternion(quaternion);
      this.parts.push({ ...part, position: position.toArray() as Vec3, scale: scale.toArray() as Vec3, rotation: [rotation.x, rotation.y, rotation.z] });
    }
  }
}
