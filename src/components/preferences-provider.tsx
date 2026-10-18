"use client";
import { useEffect } from "react";
import { useGameStore } from "@/stores/game-store";
import { Settings } from "./settings";

export function PreferencesProvider() {
  const reducedMotion = useGameStore((s) => s.playerPreferences.reducedMotion);
  useEffect(() => {
    if (!useGameStore.persist.hasHydrated()) void useGameStore.persist.rehydrate();
  }, []);
  useEffect(() => { document.documentElement.dataset.reducedMotion = String(reducedMotion); }, [reducedMotion]);
  return <Settings />;
}
