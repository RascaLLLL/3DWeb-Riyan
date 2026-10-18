"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/stores/game-store";
import type { PlayerRuntimeRef } from "@/types/player";
import { adjustCameraDistance, requestWave, setTouchMovement, setTouchRunning } from "@/systems/player/motion";

const directions = [
  { key: "up", label: "Walk forward", symbol: "↑" },
  { key: "left", label: "Walk left", symbol: "←" },
  { key: "down", label: "Walk backward", symbol: "↓" },
  { key: "right", label: "Walk right", symbol: "→" },
] as const;

export function PlayerHUD({ runtime, debug, setDebug, colliders, setColliders }: {
  runtime: PlayerRuntimeRef; debug: boolean; setDebug: (value: boolean) => void;
  colliders: boolean; setColliders: (value: boolean) => void;
}) {
  const paused = useGameStore((state) => state.gamePaused);
  const userPaused = useGameStore((state) => state.userPaused);
  const panel = useGameStore((state) => state.activePanel);
  const setPaused = useGameStore((state) => state.setPaused);
  const output = useRef<HTMLOutputElement>(null);
  const held = useRef(new Set<string>());
  const [touchRun, setTouchRun] = useState(false);
  useEffect(() => {
    if (!debug) return;
    const timer = window.setInterval(() => {
      if (!output.current) return;
      const p = runtime.current;
      output.current.textContent = `Position: ${p.position.x.toFixed(2)}, ${p.position.y.toFixed(2)}, ${p.position.z.toFixed(2)}\nState: ${p.state} | Animation: ${p.animation}\nSpeed: ${p.speed.toFixed(2)} m/s | Heading: ${(p.heading * 180 / Math.PI).toFixed(1)}°\nGrounded: ${p.grounded} | Blocked: ${p.blocked} | Contacts: ${p.collisions}\nCamera: yaw ${p.cameraYaw.toFixed(2)}, pitch ${p.cameraPitch.toFixed(2)}\nDistance: ${p.cameraActualDistance.toFixed(2)} / ${p.cameraDistance.toFixed(2)} | Obstructed: ${p.cameraObstructed}`;
    }, 250);
    return () => window.clearInterval(timer);
  }, [debug, runtime]);
  useEffect(() => {
    const clear = () => { held.current.clear(); };
    const unsubscribe = useGameStore.subscribe((game) => { if (game.gamePaused) clear(); });
    window.addEventListener("blur", clear);
    return () => { unsubscribe(); window.removeEventListener("blur", clear); };
  }, []);
  const updateTouch = () => {
    const keys = held.current;
    setTouchMovement(runtime.current, Number(keys.has("right")) - Number(keys.has("left")), Number(keys.has("up")) - Number(keys.has("down")), touchRun);
  };
  return <div className="player-hud">
    <div className="player-toolbar">
      <button className="player-tool" onClick={() => setPaused(!userPaused)} disabled={panel !== null}>{userPaused ? "Resume" : "Pause"}</button>
      <button className="player-tool" disabled={paused} onClick={() => requestWave(runtime.current)}>Wave</button>
      <button className="player-tool camera-tool" aria-label="Move camera closer" disabled={paused} onClick={() => adjustCameraDistance(runtime.current, -.8)}>+</button>
      <button className="player-tool camera-tool" aria-label="Move camera farther" disabled={paused} onClick={() => adjustCameraDistance(runtime.current, .8)}>−</button>
      {process.env.NODE_ENV === "development" && <button className="player-tool" aria-pressed={debug} onClick={() => setDebug(!debug)}>Debug</button>}
    </div>
    {userPaused && <div className="player-paused" role="status"><strong>Take a breather.</strong><span>The village is paused. Select Resume to continue.</span></div>}
    <p className="player-hint">Click or focus the scene to walk <span aria-hidden="true">·</span> Drag to look</p>
    <div className="touch-controls" aria-label="Touch movement controls">
      <div className="direction-pad">{directions.map((direction) => <button key={direction.key} className={`direction-${direction.key}`} aria-label={direction.label} disabled={paused}
        onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); held.current.add(direction.key); updateTouch(); }}
        onKeyDown={(event) => { if (event.code === "Space" || event.code === "Enter") { event.preventDefault(); held.current.add(direction.key); updateTouch(); } }}
        onKeyUp={(event) => { if (event.code === "Space" || event.code === "Enter") { held.current.delete(direction.key); updateTouch(); } }}
        onBlur={() => { held.current.delete(direction.key); updateTouch(); }}
        onPointerUp={(event) => { held.current.delete(direction.key); updateTouch(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { held.current.delete(direction.key); updateTouch(); }}
        onLostPointerCapture={() => { held.current.delete(direction.key); updateTouch(); }}>{direction.symbol}</button>)}</div>
      <button className="player-tool" aria-pressed={touchRun} disabled={paused} onClick={() => {
        const next = !touchRun;
        setTouchRunning(runtime.current, next);
        setTouchMovement(runtime.current, Number(held.current.has("right")) - Number(held.current.has("left")), Number(held.current.has("up")) - Number(held.current.has("down")), next);
        setTouchRun(next);
      }}>Run</button>
    </div>
    {process.env.NODE_ENV === "development" && debug && <aside className="player-debug" aria-label="Player diagnostics">
      <strong>Player diagnostics</strong><output ref={output} aria-live="off">Preparing diagnostics…</output>
      <label><input type="checkbox" checked={colliders} onChange={(event) => setColliders(event.target.checked)} />Collision wireframes</label>
      <p>Metrics update at 4 Hz without React frame updates.</p>
    </aside>}
  </div>;
}
