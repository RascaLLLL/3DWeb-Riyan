"use client";

import { useGameStore } from "@/stores/game-store";
import type { GraphicsQuality } from "@/types/game";
import { Modal } from "./ui/modal";
import { cameraSensitivity } from "@/data/interface";
import { usePathname } from "next/navigation";
import { ButtonLink } from "./ui/button";
import { useWorldDebugStore } from "@/stores/world-debug-store";

export function Settings() {
  const inWorld = usePathname() === "/world";
  const open = useGameStore((s) => s.activePanel === "settings");
  const quality = useGameStore((s) => s.graphicsQuality);
  const music = useGameStore((s) => s.musicVolume);
  const effects = useGameStore((s) => s.soundEffectsVolume);
  const sensitivity = useGameStore((s) => s.cameraSensitivity);
  const reducedMotion = useGameStore((s) => s.playerPreferences.reducedMotion);
  const setPanel = useGameStore((s) => s.setPanel);
  const setQuality = useGameStore((s) => s.setGraphicsQuality);
  const setVolume = useGameStore((s) => s.setVolume);
  const setPreferences = useGameStore((s) => s.setPlayerPreferences);
  const setSensitivity = useGameStore((s) => s.setCameraSensitivity);
  const debug = useWorldDebugStore((s) => s.visible);
  const colliders = useWorldDebugStore((s) => s.colliders);
  return <Modal open={open} onClose={() => setPanel(null)} title="Make yourself at home" presentation={inWorld ? "overlay" : "document"} className="settings-modal">
    <p className="settings-intro">Tune the village to your pace.</p>
    <fieldset className="settings-group"><legend>View & movement</legend>
      <label className="setting">Graphics quality<select value={quality} onChange={(e) => setQuality(e.target.value as GraphicsQuality)}><option value="low">Low · lighter rendering</option><option value="medium">Medium · balanced</option><option value="high">High · sharper shadows</option></select></label>
      <label className="setting" htmlFor="camera-sensitivity"><span>Camera sensitivity</span><output htmlFor="camera-sensitivity">{sensitivity.toFixed(1)}×</output></label>
      <input id="camera-sensitivity" type="range" min={cameraSensitivity.min} max={cameraSensitivity.max} step={cameraSensitivity.step} value={sensitivity} aria-valuetext={`${sensitivity.toFixed(1)} times normal`} aria-describedby="sensitivity-hint" onChange={(e) => setSensitivity(Number(e.target.value))} />
      <p id="sensitivity-hint" className="setting-hint">Adjust how quickly the camera turns when you drag.</p>
    </fieldset>
    <fieldset className="settings-group" aria-describedby="audio-hint"><legend>Sound preferences</legend>
      <p id="audio-hint" className="setting-hint">Saved for future village audio. No music or sound effects play yet.</p>
      <label className="setting" htmlFor="music-volume"><span>Music volume</span><output htmlFor="music-volume">{Math.round(music * 100)}%</output></label>
      <input id="music-volume" type="range" min="0" max="1" step="0.01" value={music} aria-valuetext={`${Math.round(music * 100)} percent`} onChange={(e) => setVolume("musicVolume", Number(e.target.value))} />
      <label className="setting" htmlFor="effects-volume"><span>SFX volume</span><output htmlFor="effects-volume">{Math.round(effects * 100)}%</output></label>
      <input id="effects-volume" type="range" min="0" max="1" step="0.01" value={effects} aria-valuetext={`${Math.round(effects * 100)} percent`} onChange={(e) => setVolume("soundEffectsVolume", Number(e.target.value))} />
    </fieldset>
    <fieldset className="settings-group"><legend>Comfort</legend>
      <label className="setting checkbox"><input type="checkbox" checked={reducedMotion} aria-describedby="motion-hint" onChange={(e) => setPreferences({ reducedMotion: e.target.checked })} /><span>Reduce interface motion</span></label>
      <p id="motion-hint" className="setting-hint">Your device’s reduced motion preference is always respected.</p>
    </fieldset>
    {inWorld && <nav className="settings-routes" aria-label="Leave exploration"><ButtonLink href="/portfolio" className="button-secondary">Quick Portfolio</ButtonLink><ButtonLink href="/" className="button-secondary">Main menu</ButtonLink></nav>}
    {inWorld && process.env.NODE_ENV === "development" && <details className="settings-developer"><summary>Developer tools</summary>
      <label className="setting checkbox"><input type="checkbox" checked={debug} onChange={(event) => useWorldDebugStore.getState().setVisible(event.target.checked)} />Show player diagnostics</label>
      <label className="setting checkbox"><input type="checkbox" checked={colliders} onChange={(event) => useWorldDebugStore.getState().setColliders(event.target.checked)} />Show collision wireframes with diagnostics</label>
    </details>}
    <p className="settings-save-note">Preferences save on this device when browser storage is available.</p>
  </Modal>;
}

