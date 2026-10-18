"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { bindPlayerInput } from "@/systems/player/input";
import type { PlayerRuntimeRef } from "@/types/player";

export function usePlayerInput(runtime: PlayerRuntimeRef) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => bindPlayerInput(canvas, runtime), [canvas, runtime]);
}
