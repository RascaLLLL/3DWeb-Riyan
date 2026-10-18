"use client";

import { create } from "zustand";
import { interactionConfig } from "@/data/building-interactions";
import { useGameStore } from "./game-store";
import type { BuildingId } from "@/types/world";
import type { BuildingPanelPhase } from "@/types/interaction";
import type { NpcId } from "@/types/npc";

interface InteractionState {
  nearbyId: BuildingId | null;
  nearbyNpcId: NpcId | null;
  location: string;
  buildingId: BuildingId | null;
  phase: BuildingPanelPhase;
  cooldownUntil: number;
  publish: (nearbyId: BuildingId | null, location: string, nearbyNpcId?: NpcId | null) => void;
  open: (id: BuildingId, now: number) => void;
  openFromDialogue: (id: BuildingId) => boolean;
  defer: (now: number) => void;
  beginClose: () => void;
  finishClose: (now: number) => void;
  reset: () => void;
}

const initial = {
  nearbyId: null, nearbyNpcId: null, location: interactionConfig.squareName as string,
  buildingId: null, phase: "closed" as BuildingPanelPhase, cooldownUntil: 0,
};

// This session state is deliberately not persisted. Coordinates remain in the player runtime.
export const useInteractionStore = create<InteractionState>((set, get) => ({
  ...initial,
  publish: (nearbyId, location, nearbyNpcId = null) => {
    if (get().nearbyId !== nearbyId || get().location !== location || get().nearbyNpcId !== nearbyNpcId) set({ nearbyId, location, nearbyNpcId });
  },
  open: (id, now) => {
    const game = useGameStore.getState(), current = get();
    if (!game.gameStarted || game.gamePaused || game.activePanel !== null
      || current.phase !== "closed" || current.nearbyId !== id || now < current.cooldownUntil) return;
    // Pause before mounting the native dialog; the same scene/physics bodies stay alive.
    game.setPanel("building");
    set({ buildingId: id, phase: "open", nearbyId: null, nearbyNpcId: null });
  },
  openFromDialogue: (id) => {
    const game = useGameStore.getState();
    if (!game.gameStarted || game.activePanel !== "dialogue" || get().phase !== "closed") return false;
    game.setPanel("building");
    set({ buildingId: id, phase: "open", nearbyId: null, nearbyNpcId: null });
    return true;
  },
  defer: (now) => set({ nearbyId: null, nearbyNpcId: null, cooldownUntil: now + interactionConfig.reopenDelayMs }),
  beginClose: () => { if (get().phase === "open") set({ phase: "closing" }); },
  finishClose: (now) => {
    if (get().phase !== "closing") return;
    set({ buildingId: null, phase: "closed", nearbyId: null, nearbyNpcId: null, cooldownUntil: now + interactionConfig.reopenDelayMs });
    if (useGameStore.getState().activePanel === "building") useGameStore.getState().setPanel(null);
  },
  reset: () => {
    set(initial);
    if (useGameStore.getState().activePanel === "building") useGameStore.getState().setPanel(null);
  },
}));
