"use client";

import { create } from "zustand";
import { discoveryObjectives } from "@/data/discoveries";
import type { DiscoveryObjectiveId } from "@/types/dialogue";
import type { BuildingId } from "@/types/world";

interface GuidanceState {
  destination: BuildingId | null;
  completedObjectives: DiscoveryObjectiveId[];
  highlight: (id: BuildingId | null) => void;
  complete: (id: DiscoveryObjectiveId) => void;
  reset: () => void;
}
export const useGuidanceStore = create<GuidanceState>((set, get) => ({
  destination: null, completedObjectives: [],
  highlight: (destination) => { if (get().destination !== destination) set({ destination }); },
  complete: (id) => {
    if (discoveryObjectives[id] && !get().completedObjectives.includes(id)) set({ completedObjectives: [...get().completedObjectives, id] });
  },
  reset: () => set({ destination: null, completedObjectives: [] }),
}));
