"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import { Vector3 } from "three";
import { playerConfig } from "@/data/player";
import { useGameStore } from "@/stores/game-store";
import { recordCameraState, shortestAngle } from "@/systems/player/motion";
import { cameraSafeDistance } from "@/systems/player/camera";
import type { PlayerBodyRef, PlayerRuntimeRef } from "@/types/player";

export function ThirdPersonCamera({ runtime, body }: { runtime: PlayerRuntimeRef; body: PlayerBodyRef }) {
  const camera = useThree((state) => state.camera);
  const { world, rapier } = useRapier();
  const scratch = useMemo(() => ({
    target: new Vector3(), desiredTarget: new Vector3(), direction: new Vector3(), desiredPosition: new Vector3(), sweep: new Vector3(),
    sphere: new rapier.Ball(playerConfig.camera.collisionRadius),
  }), [rapier]);
  const orbit = useRef({ yaw: runtime.current.cameraYaw, pitch: runtime.current.cameraPitch, distance: runtime.current.cameraDistance });
  useLayoutEffect(() => {
    const state = runtime.current, settings = playerConfig.camera;
    scratch.target.set(state.position.x, state.position.y - playerConfig.centerHeight + settings.targetHeight, state.position.z);
    camera.position.set(scratch.target.x + Math.sin(state.cameraYaw) * Math.cos(state.cameraPitch) * state.cameraDistance,
      scratch.target.y + Math.sin(state.cameraPitch) * state.cameraDistance,
      scratch.target.z + Math.cos(state.cameraYaw) * Math.cos(state.cameraPitch) * state.cameraDistance);
    camera.lookAt(scratch.target);
  }, [camera, runtime, scratch]);
  useFrame((_, delta) => {
    const state = runtime.current;
    if (useGameStore.getState().gamePaused || !state.input.focused) return;
    const dt = Math.min(delta, .05), settings = playerConfig.camera;
    const rotationAlpha = 1 - Math.exp(-settings.rotationSmoothing * dt);
    orbit.current.yaw += shortestAngle(orbit.current.yaw, state.cameraYaw) * rotationAlpha;
    orbit.current.pitch += (state.cameraPitch - orbit.current.pitch) * rotationAlpha;
    scratch.desiredTarget.set(state.position.x, state.position.y - playerConfig.centerHeight + settings.targetHeight, state.position.z);
    scratch.target.lerp(scratch.desiredTarget, 1 - Math.exp(-settings.followSmoothing * dt));
    const pitch = orbit.current.pitch, yaw = orbit.current.yaw;
    scratch.direction.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    const safeDistance = cameraSafeDistance(world, scratch.sphere, scratch.target, scratch.direction, state.cameraDistance, body.current ?? undefined);
    const rate = safeDistance < orbit.current.distance ? 24 : 5;
    orbit.current.distance += (safeDistance - orbit.current.distance) * (1 - Math.exp(-rate * dt));
    scratch.desiredPosition.copy(scratch.direction).multiplyScalar(orbit.current.distance).add(scratch.target);
    camera.position.lerp(scratch.desiredPosition, 1 - Math.exp(-14 * dt));
    // Follow smoothing can cross a corner; clamp that final path as well.
    scratch.sweep.subVectors(camera.position, scratch.target);
    const proposedDistance = scratch.sweep.length();
    scratch.sweep.normalize();
    const finalDistance = cameraSafeDistance(world, scratch.sphere, scratch.target, scratch.sweep, proposedDistance, body.current ?? undefined);
    if (finalDistance < proposedDistance) camera.position.copy(scratch.sweep).multiplyScalar(finalDistance).add(scratch.target);
    camera.lookAt(scratch.target);
    recordCameraState(state, safeDistance < state.cameraDistance || finalDistance < proposedDistance, camera.position.distanceTo(scratch.target));
  });
  return null;
}
