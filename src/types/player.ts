import type { RapierRigidBody } from "@react-three/rapier";
import type { RefObject } from "react";

export type MovementState = "idle" | "walking" | "running" | "interacting" | "paused";
export type CharacterAnimation = Exclude<MovementState, "paused"> | "turning";

export interface PlayerInput {
  keys: Set<string>;
  touchX: number;
  touchY: number;
  touchRun: boolean;
  focused: boolean;
  dragging: boolean;
  pointerId: number;
  lastPointerX: number;
  lastPointerY: number;
}

export interface PlayerRuntime {
  position: { x: number; y: number; z: number };
  velocity: { x: number; z: number };
  verticalVelocity: number;
  heading: number;
  turnAmount: number;
  speed: number;
  state: MovementState;
  animation: CharacterAnimation;
  grounded: boolean;
  blocked: boolean;
  collisions: number;
  interactionRemaining: number;
  waveRequested: boolean;
  interactionRequested: boolean;
  elapsed: number;
  cameraYaw: number;
  cameraPitch: number;
  cameraDistance: number;
  cameraActualDistance: number;
  cameraObstructed: boolean;
  input: PlayerInput;
}

export type PlayerRuntimeRef = RefObject<PlayerRuntime>;
export type PlayerBodyRef = RefObject<RapierRigidBody | null>;
