"use client";

import { create } from "zustand";
import type { BuildingId } from "@/types/world";

interface GuidanceState {
  destination: BuildingId | null;
  highlight: (id: BuildingId | null) => void;
  reset: () => void;
}
export const useGuidanceStore = create<GuidanceState>((set, get) => ({
  destination: null,
  highlight: (destination) => { if (get().destination !== destination) set({ destination }); },
  reset: () => set({ destination: null }),
}));
