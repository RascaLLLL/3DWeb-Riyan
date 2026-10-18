"use client";

import { useEffect, useMemo, useRef } from "react";
import { CapsuleCollider, RigidBody, useAfterPhysicsStep, useBeforePhysicsStep, useRapier } from "@react-three/rapier";
import type { KinematicCharacterController } from "@dimforge/rapier3d-compat";
import { playerConfig } from "@/data/player";
import { worldConfig } from "@/data/world";
import { usePlayerInput } from "@/hooks/use-player-input";
import { useGameStore } from "@/stores/game-store";
import { configureCharacterController, createControllerScratch, stepCharacter } from "@/systems/player/controller";
import { recordPlayerPosition } from "@/systems/player/motion";
import type { PlayerBodyRef, PlayerRuntimeRef } from "@/types/player";
import { CivilianCharacter } from "./civilian-character";

export function PlayerController({ runtime, body }: { runtime: PlayerRuntimeRef; body: PlayerBodyRef }) {
  const { world } = useRapier();
  const controller = useRef<KinematicCharacterController | null>(null);
  const scratch = useMemo(() => createControllerScratch(), []);
  const spawn = useMemo(() => [worldConfig.spawn.position[0], worldConfig.spawn.position[1] + playerConfig.centerHeight + playerConfig.contactOffset, worldConfig.spawn.position[2]] as [number, number, number], []);
  usePlayerInput(runtime);
  useEffect(() => {
    const instance = configureCharacterController(world);
    controller.current = instance;
    return () => { controller.current = null; world.removeCharacterController(instance); };
  }, [world]);
  useBeforePhysicsStep(() => {
    if (!body.current || !controller.current) return;
    const collider = body.current.collider(0);
    if (!collider) return;
    const game = useGameStore.getState();
    stepCharacter(runtime.current, body.current, collider, controller.current, playerConfig.fixedStep,
      game.gamePaused || game.activePanel !== null, scratch);
  });
  useAfterPhysicsStep(() => {
    if (!body.current) return;
    const position = body.current.translation();
    recordPlayerPosition(runtime.current, position);
  });
  return <RigidBody ref={body} type="kinematicPosition" colliders={false} position={spawn}
    enabledRotations={[false, false, false]} name="village-resident" friction={0} restitution={0}>
    <CapsuleCollider args={[playerConfig.capsuleHalfHeight, playerConfig.radius]} />
    <CivilianCharacter runtime={runtime} />
  </RigidBody>;
}
