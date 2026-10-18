"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ActivePanel, GraphicsQuality, PlayerPreferences, SavedSettings } from "@/types/game";
import { preferenceStorage } from "@/systems/preference-storage";

interface GameState extends SavedSettings {
  gameStarted: boolean;
  gamePaused: boolean;
  activePanel: ActivePanel;
  startGame: () => void;
  stopGame: () => void;
  setPanel: (panel: ActivePanel) => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  setVolume: (channel: "musicVolume" | "soundEffectsVolume", volume: number) => void;
  setPlayerPreferences: (preferences: Partial<PlayerPreferences>) => void;
}

const defaults: SavedSettings = {
  graphicsQuality: "medium", musicVolume: 0.5, soundEffectsVolume: 0.7,
  playerPreferences: { reducedMotion: false },
};

// Validate persisted data: localStorage may be edited or contain older settings.
function readSettings(value: unknown): SavedSettings {
  const saved = (value ?? {}) as Partial<SavedSettings>;
  const volume = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(1, value)) : fallback;
  return {
    graphicsQuality: ["low", "medium", "high"].includes(saved.graphicsQuality ?? "")
      ? saved.graphicsQuality! : defaults.graphicsQuality,
    musicVolume: volume(saved.musicVolume, defaults.musicVolume),
    soundEffectsVolume: volume(saved.soundEffectsVolume, defaults.soundEffectsVolume),
    playerPreferences: { reducedMotion: saved.playerPreferences?.reducedMotion === true },
  };
}

export const useGameStore = create<GameState>()(persist((set) => ({
  ...defaults,
  gameStarted: false, gamePaused: false, activePanel: null,
  startGame: () => set({ gameStarted: true, gamePaused: false, activePanel: null }),
  stopGame: () => set({ gameStarted: false, gamePaused: false, activePanel: null }),
  setPanel: (activePanel) => set((state) => ({ activePanel, gamePaused: state.gameStarted && activePanel !== null })),
  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),
  setVolume: (channel, value) => set({ [channel]: Math.max(0, Math.min(1, value)) }),
  setPlayerPreferences: (preferences) => set((state) => ({ playerPreferences: { ...state.playerPreferences, ...preferences } })),
}), {
  name: "riyan-village-settings", version: 1,
  storage: createJSONStorage(() => preferenceStorage),
  skipHydration: true,
  partialize: ({ graphicsQuality, musicVolume, soundEffectsVolume, playerPreferences }) =>
    ({ graphicsQuality, musicVolume, soundEffectsVolume, playerPreferences }),
  merge: (saved, current) => ({ ...current, ...readSettings(saved) }),
}));
