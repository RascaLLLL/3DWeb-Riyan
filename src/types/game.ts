export type GraphicsQuality = "low" | "medium" | "high";
export type ActivePanel = "settings" | "building" | "dialogue" | null;

export interface PlayerPreferences {
  reducedMotion: boolean;
}

export interface SavedSettings {
  graphicsQuality: GraphicsQuality;
  musicVolume: number;
  soundEffectsVolume: number;
  playerPreferences: PlayerPreferences;
}
