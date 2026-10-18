"use client";

import { useGameStore } from "@/stores/game-store";
import type { GraphicsQuality } from "@/types/game";
import { Modal } from "./ui/modal";

export function Settings() {
  const open = useGameStore((s) => s.activePanel === "settings");
  const quality = useGameStore((s) => s.graphicsQuality);
  const music = useGameStore((s) => s.musicVolume);
  const effects = useGameStore((s) => s.soundEffectsVolume);
  const reducedMotion = useGameStore((s) => s.playerPreferences.reducedMotion);
  const setPanel = useGameStore((s) => s.setPanel);
  const setQuality = useGameStore((s) => s.setGraphicsQuality);
  const setVolume = useGameStore((s) => s.setVolume);
  const setPreferences = useGameStore((s) => s.setPlayerPreferences);
  return <Modal open={open} onClose={() => setPanel(null)} title="Make yourself at home">
    <p className="muted">Preferences are saved on this device when local storage is available.</p>
    <label className="setting">Graphics quality<select value={quality} onChange={(e) => setQuality(e.target.value as GraphicsQuality)}><option value="low">Low · lighter rendering</option><option value="medium">Medium · balanced</option><option value="high">High · sharper shadows</option></select></label>
    <label className="setting">Music volume <output>{Math.round(music * 100)}%</output><input aria-label="Music volume" type="range" min="0" max="1" step="0.01" value={music} onChange={(e) => setVolume("musicVolume", Number(e.target.value))} /></label>
    <label className="setting">Sound effects <output>{Math.round(effects * 100)}%</output><input aria-label="Sound effects volume" type="range" min="0" max="1" step="0.01" value={effects} onChange={(e) => setVolume("soundEffectsVolume", Number(e.target.value))} /></label>
    <p className="small muted">Audio preferences are reserved for a later phase. No audio plays yet.</p>
    <label className="setting checkbox"><input type="checkbox" checked={reducedMotion} onChange={(e) => setPreferences({ reducedMotion: e.target.checked })} />Reduce interface motion</label>
    <p className="small muted">Your device’s reduced motion preference is always respected.</p>
  </Modal>;
}

