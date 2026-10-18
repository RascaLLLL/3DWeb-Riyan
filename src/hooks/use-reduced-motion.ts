"use client";

import { useSyncExternalStore } from "react";
import { useGameStore } from "@/stores/game-store";

function subscribe(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const snapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverSnapshot = () => false;
export function useReducedMotion() {
  const saved = useGameStore((state) => state.playerPreferences.reducedMotion);
  const system = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return saved || system;
}
