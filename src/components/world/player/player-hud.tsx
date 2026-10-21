"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/stores/game-store";
import type { PlayerRuntimeRef } from "@/types/player";
import { adjustCameraDistance, requestWave, setTouchMovement, setTouchRunning } from "@/systems/player/motion";
import { InterfaceIcon } from "@/components/ui/interface-icon";

const directions = [
  { key: "up", label: "Walk forward", symbol: "↑" },
  { key: "left", label: "Walk left", symbol: "←" },
  { key: "down", label: "Walk backward", symbol: "↓" },
  { key: "right", label: "Walk right", symbol: "→" },
] as const;

export function PlayerHUD({ runtime, restoreFocus }: { runtime: PlayerRuntimeRef; restoreFocus: () => void }) {
  const paused = useGameStore((state) => state.gamePaused);
  const setPaused = useGameStore((state) => state.setPaused);
  const held = useRef(new Set<string>());
  const controls = useRef<HTMLDetailsElement>(null);
  const [touchRun, setTouchRun] = useState(false);
  useEffect(() => {
    const clear = () => { held.current.clear(); };
    const unsubscribe = useGameStore.subscribe((game) => {
      if (game.gamePaused) { clear(); if (controls.current) controls.current.open = false; }
    });
    const dismissControls = (event: PointerEvent) => {
      if (controls.current && event.target instanceof Node && !controls.current.contains(event.target)) controls.current.open = false;
    };
    window.addEventListener("blur", clear);
    window.addEventListener("pointerdown", dismissControls);
    return () => { unsubscribe(); window.removeEventListener("blur", clear); window.removeEventListener("pointerdown", dismissControls); };
  }, []);
  const updateTouch = () => {
    const keys = held.current;
    setTouchMovement(runtime.current, Number(keys.has("right")) - Number(keys.has("left")), Number(keys.has("up")) - Number(keys.has("down")), touchRun);
  };
  return <div className="player-hud">
    <details className="player-controls" ref={controls}
      onKeyDown={(event) => { if (event.key === "Escape" && event.currentTarget.open) { event.preventDefault(); event.stopPropagation(); event.currentTarget.open = false; restoreFocus(); } }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}>
      <summary className="hud-action"><InterfaceIcon name="controls" />Controls</summary>
      <div className="controls-popover hud-surface">
        <p className="eyebrow">Make yourself at home</p>
        <dl><div><dt>Move</dt><dd>WASD / Arrow keys</dd></div><div><dt>Run</dt><dd>Hold Shift</dd></div><div><dt>Talk / Enter</dt><dd>E near a person or entrance</dd></div><div><dt>Look</dt><dd>Drag the scene</dd></div><div><dt>Camera distance</dt><dd>Scroll or + / −</dd></div><div><dt>Pause / Close</dt><dd>Escape</dd></div></dl>
        <p className="control-note">Focus the scene to walk. Use the on-screen movement buttons on touch devices.</p>
        <div className="control-actions">
          <button className="player-tool" disabled={paused} onClick={() => { if (controls.current) controls.current.open = false; restoreFocus(); requestWave(runtime.current); }}>Wave</button>
          <button className="player-tool camera-tool" aria-label="Move camera closer" disabled={paused} onClick={() => adjustCameraDistance(runtime.current, -.8)}>+</button>
          <button className="player-tool camera-tool" aria-label="Move camera farther" disabled={paused} onClick={() => adjustCameraDistance(runtime.current, .8)}>−</button>
          <button className="player-tool" onClick={() => setPaused(true)} disabled={paused}>Pause</button>
        </div>
      </div>
    </details>
    <p className="player-hint hud-surface"><span className="desktop-hint">WASD Move · Drag to Look</span><span className="touch-hint">Touch to Move · Drag to Look</span></p>
    <div className="touch-controls" aria-label="Touch movement controls">
      <div className="direction-pad">{directions.map((direction) => <button key={direction.key} className={`direction-${direction.key}`} aria-label={direction.label} disabled={paused}
        onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); held.current.add(direction.key); updateTouch(); }}
        onKeyDown={(event) => { if (event.code === "Space" || event.code === "Enter") { event.preventDefault(); held.current.add(direction.key); updateTouch(); } }}
        onKeyUp={(event) => { if (event.code === "Space" || event.code === "Enter") { held.current.delete(direction.key); updateTouch(); } }}
        onBlur={() => { held.current.delete(direction.key); updateTouch(); }}
        onPointerUp={(event) => { held.current.delete(direction.key); updateTouch(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { held.current.delete(direction.key); updateTouch(); }}
        onLostPointerCapture={() => { held.current.delete(direction.key); updateTouch(); }}>{direction.symbol}</button>)}</div>
      <button className="player-tool touch-run" aria-pressed={touchRun} disabled={paused} onClick={() => {
        const next = !touchRun;
        setTouchRunning(runtime.current, next);
        setTouchMovement(runtime.current, Number(held.current.has("right")) - Number(held.current.has("left")), Number(held.current.has("up")) - Number(held.current.has("down")), next);
        setTouchRun(next);
      }}>Run</button>
    </div>
  </div>;
}
