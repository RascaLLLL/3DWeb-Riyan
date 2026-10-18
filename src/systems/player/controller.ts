import type { KinematicCharacterController, World, Collider, RigidBody } from "@dimforge/rapier3d-compat";
import { playerConfig as config } from "@/data/player";
import { worldConfig } from "@/data/world";
import type { PlayerRuntime } from "@/types/player";
import { updatePlayerMotion } from "./motion";

export function configureCharacterController(world: World) {
  const controller = world.createCharacterController(config.contactOffset);
  controller.enableAutostep(config.stepHeight, config.stepWidth, false);
  controller.enableSnapToGround(config.snapDistance);
  controller.setMaxSlopeClimbAngle(config.maxSlope);
  controller.setMinSlopeSlideAngle(config.slideSlope);
  controller.setApplyImpulsesToDynamicBodies(false);
  controller.setSlideEnabled(true);
  return controller;
}

export function createControllerScratch() {
  return { direction: { x: 0, z: 0 }, desired: { x: 0, y: 0, z: 0 }, next: { x: 0, y: 0, z: 0 } };
}

export function stepCharacter(runtime: PlayerRuntime, body: RigidBody, collider: Collider,
  controller: KinematicCharacterController, dt: number, blocked: boolean, scratch: ReturnType<typeof createControllerScratch>) {
  updatePlayerMotion(runtime, dt, blocked, scratch.direction);
  const position = body.translation();
  if (!Number.isFinite(position.y) || position.y < -5 || Math.hypot(position.x, position.z) > worldConfig.terrain.radius + 2) {
    const [x, y, z] = worldConfig.spawn.position;
    scratch.next.x = x; scratch.next.y = y + config.centerHeight + config.contactOffset; scratch.next.z = z;
    body.setTranslation(scratch.next, true);
    body.setNextKinematicTranslation(scratch.next);
    runtime.verticalVelocity = 0;
    return;
  }
  if (runtime.state === "paused") {
    body.setNextKinematicTranslation(position);
    return;
  }
  runtime.verticalVelocity = runtime.grounded ? -1.5 : Math.max(-config.terminalVelocity, runtime.verticalVelocity - config.gravity * dt);
  scratch.desired.x = runtime.velocity.x * dt;
  scratch.desired.y = runtime.verticalVelocity * dt;
  scratch.desired.z = runtime.velocity.z * dt;
  controller.computeColliderMovement(collider, scratch.desired);
  const movement = controller.computedMovement();
  runtime.grounded = controller.computedGrounded();
  runtime.collisions = controller.numComputedCollisions();
  const desiredLength = Math.hypot(scratch.desired.x, scratch.desired.z);
  const actualSpeed = Math.hypot(movement.x, movement.z) / dt;
  runtime.blocked = desiredLength > .005 && actualSpeed < runtime.speed * .45;
  runtime.speed = actualSpeed;
  if (runtime.blocked) { runtime.state = "idle"; runtime.animation = "idle"; }
  scratch.next.x = position.x + movement.x;
  scratch.next.y = position.y + movement.y;
  scratch.next.z = position.z + movement.z;
  body.setNextKinematicTranslation(scratch.next);
}
