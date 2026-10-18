import { playerConfig as config } from "@/data/player";
import { worldConfig } from "@/data/world";
import type { PlayerRuntime } from "@/types/player";

export function createPlayerRuntime(): PlayerRuntime {
  const [x, y, z] = worldConfig.spawn.position;
  return {
    position: { x, y: y + config.centerHeight + config.contactOffset, z },
    velocity: { x: 0, z: 0 }, verticalVelocity: 0,
    heading: worldConfig.spawn.rotation, turnAmount: 0, speed: 0,
    state: "idle", animation: "idle", grounded: false, blocked: false, collisions: 0,
    interactionRemaining: 0, waveRequested: false, elapsed: 0,
    cameraYaw: config.camera.yaw, cameraPitch: config.camera.pitch,
    cameraDistance: config.camera.distance, cameraActualDistance: config.camera.distance, cameraObstructed: false,
    input: { keys: new Set(), touchX: 0, touchY: 0, touchRun: false, focused: true,
      dragging: false, pointerId: -1, lastPointerX: 0, lastPointerY: 0 },
  };
}

export function clearPlayerInput(runtime: PlayerRuntime) {
  runtime.input.keys.clear();
  runtime.input.touchX = 0; runtime.input.touchY = 0; runtime.input.touchRun = false;
  runtime.input.dragging = false; runtime.input.pointerId = -1;
  runtime.velocity.x = 0; runtime.velocity.z = 0; runtime.speed = 0;
  runtime.waveRequested = false;
}

export function setTouchMovement(runtime: PlayerRuntime, x: number, y: number, running: boolean) {
  runtime.input.touchX = x; runtime.input.touchY = y; runtime.input.touchRun = running;
  runtime.input.focused = true;
}

export function requestWave(runtime: PlayerRuntime) {
  runtime.input.focused = true; runtime.waveRequested = true;
}

export function setTouchRunning(runtime: PlayerRuntime, running: boolean) {
  runtime.input.touchRun = running;
}

export function adjustCameraDistance(runtime: PlayerRuntime, change: number) {
  runtime.cameraDistance = Math.max(config.camera.minDistance, Math.min(config.camera.maxDistance, runtime.cameraDistance + change));
  runtime.input.focused = true;
}

export function recordPlayerPosition(runtime: PlayerRuntime, position: { x: number; y: number; z: number }) {
  runtime.position.x = position.x; runtime.position.y = position.y; runtime.position.z = position.z;
}

export function recordCameraState(runtime: PlayerRuntime, obstructed: boolean, distance: number) {
  runtime.cameraObstructed = obstructed; runtime.cameraActualDistance = distance;
}

export function shortestAngle(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

export function cameraRelativeDirection(x: number, forward: number, yaw: number, out: { x: number; z: number }) {
  const length = Math.hypot(x, forward);
  const scale = length > 1 ? 1 / length : 1;
  out.x = (x * Math.cos(yaw) - forward * Math.sin(yaw)) * scale;
  out.z = (-x * Math.sin(yaw) - forward * Math.cos(yaw)) * scale;
}

/** Fixed-step math mutates only the runtime; no React or Zustand writes. */
export function updatePlayerMotion(runtime: PlayerRuntime, dt: number, blocked: boolean, direction: { x: number; z: number }) {
  if (blocked || !runtime.input.focused) {
    clearPlayerInput(runtime);
    runtime.state = "paused";
    runtime.turnAmount = 0;
    return;
  }
  runtime.elapsed += dt;
  if (runtime.waveRequested) {
    runtime.interactionRemaining = config.waveDuration;
    runtime.waveRequested = false;
  }
  const keys = runtime.input.keys;
  const x = Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft")) + runtime.input.touchX;
  const forward = Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown")) + runtime.input.touchY;
  const interacting = runtime.interactionRemaining > 0;
  cameraRelativeDirection(interacting ? 0 : x, interacting ? 0 : forward, runtime.cameraYaw, direction);
  const moving = Math.hypot(direction.x, direction.z) > .01;
  const running = keys.has("ShiftLeft") || keys.has("ShiftRight") || runtime.input.touchRun;
  const targetSpeed = running ? config.runSpeed : config.walkSpeed;
  const alpha = 1 - Math.exp(-(moving ? config.acceleration : config.deceleration) * dt);
  runtime.velocity.x += (direction.x * targetSpeed - runtime.velocity.x) * alpha;
  runtime.velocity.z += (direction.z * targetSpeed - runtime.velocity.z) * alpha;
  if (Math.hypot(runtime.velocity.x, runtime.velocity.z) < .015) { runtime.velocity.x = 0; runtime.velocity.z = 0; }
  runtime.speed = Math.hypot(runtime.velocity.x, runtime.velocity.z);
  runtime.turnAmount = 0;
  if (moving) {
    const difference = shortestAngle(runtime.heading, Math.atan2(direction.x, direction.z));
    runtime.turnAmount = difference;
    runtime.heading += difference * (1 - Math.exp(-config.turnSmoothing * dt));
  }
  runtime.state = interacting ? "interacting" : runtime.speed < .04 ? "idle" : running && runtime.speed > config.walkSpeed ? "running" : "walking";
  runtime.animation = interacting ? "interacting" : Math.abs(runtime.turnAmount) > .5 ? "turning" : runtime.state;
  runtime.interactionRemaining = Math.max(0, runtime.interactionRemaining - dt);
}
