"use client";

import { create } from "zustand";

interface WorldDebugState {
  visible: boolean;
  colliders: boolean;
  setVisible: (visible: boolean) => void;
  setColliders: (colliders: boolean) => void;
  reset: () => void;
}

/** Session-only development tools. Never persisted with visitor preferences. */
export const useWorldDebugStore = create<WorldDebugState>((set) => ({
  visible: false, colliders: false,
  setVisible: (visible) => set({ visible }),
  setColliders: (colliders) => set({ colliders }),
  reset: () => set({ visible: false, colliders: false }),
}));
