"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ActivePanel, GraphicsQuality, PlayerPreferences, SavedSettings } from "@/types/game";
import { preferenceStorage } from "@/systems/preference-storage";
import { cameraSensitivity, validCameraSensitivity } from "@/data/interface";

interface GameState extends SavedSettings {
  gameStarted: boolean;
  gamePaused: boolean;
  userPaused: boolean;
  activePanel: ActivePanel;
  startGame: () => void;
  stopGame: () => void;
  setPanel: (panel: ActivePanel) => void;
  setPaused: (paused: boolean) => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  setCameraSensitivity: (value: number) => void;
  setVolume: (channel: "musicVolume" | "soundEffectsVolume", volume: number) => void;
  setPlayerPreferences: (preferences: Partial<PlayerPreferences>) => void;
}

const defaults: SavedSettings = {
  graphicsQuality: "medium", musicVolume: 0.5, soundEffectsVolume: 0.7,
  cameraSensitivity: cameraSensitivity.default,
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
    cameraSensitivity: validCameraSensitivity(saved.cameraSensitivity),
    playerPreferences: { reducedMotion: saved.playerPreferences?.reducedMotion === true },
  };
}

export const useGameStore = create<GameState>()(persist((set) => ({
  ...defaults,
  gameStarted: false, gamePaused: false, userPaused: false, activePanel: null,
  startGame: () => set({ gameStarted: true, gamePaused: false, userPaused: false, activePanel: null }),
  stopGame: () => set({ gameStarted: false, gamePaused: false, userPaused: false, activePanel: null }),
  setPanel: (activePanel) => set((state) => ({ activePanel, gamePaused: state.gameStarted && (state.userPaused || activePanel !== null) })),
  setPaused: (userPaused) => set((state) => ({ userPaused, gamePaused: state.gameStarted && (userPaused || state.activePanel !== null) })),
  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),
  setCameraSensitivity: (value) => set({ cameraSensitivity: validCameraSensitivity(value) }),
  setVolume: (channel, value) => set({ [channel]: Math.max(0, Math.min(1, value)) }),
  setPlayerPreferences: (preferences) => set((state) => ({ playerPreferences: { ...state.playerPreferences, ...preferences } })),
}), {
  name: "riyan-village-settings", version: 1,
  storage: createJSONStorage(() => preferenceStorage),
  skipHydration: true,
  partialize: ({ graphicsQuality, musicVolume, soundEffectsVolume, cameraSensitivity, playerPreferences }) =>
    ({ graphicsQuality, musicVolume, soundEffectsVolume, cameraSensitivity, playerPreferences }),
  merge: (saved, current) => ({ ...current, ...readSettings(saved) }),
}));
