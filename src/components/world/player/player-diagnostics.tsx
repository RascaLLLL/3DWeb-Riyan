"use client";

import { useEffect, useRef } from "react";
import { useWorldDebugStore } from "@/stores/world-debug-store";
import type { PlayerRuntimeRef } from "@/types/player";

export function PlayerDiagnostics({ runtime }: { runtime: PlayerRuntimeRef }) {
  const visible = useWorldDebugStore((state) => state.visible);
  const colliders = useWorldDebugStore((state) => state.colliders);
  const output = useRef<HTMLOutputElement>(null);
  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => {
      if (!output.current) return;
      const p = runtime.current;
      output.current.textContent = `Position: ${p.position.x.toFixed(2)}, ${p.position.y.toFixed(2)}, ${p.position.z.toFixed(2)}\nState: ${p.state} | Animation: ${p.animation}\nSpeed: ${p.speed.toFixed(2)} m/s | Heading: ${(p.heading * 180 / Math.PI).toFixed(1)}°\nGrounded: ${p.grounded} | Blocked: ${p.blocked} | Contacts: ${p.collisions}\nCamera: yaw ${p.cameraYaw.toFixed(2)}, pitch ${p.cameraPitch.toFixed(2)}\nDistance: ${p.cameraActualDistance.toFixed(2)} / ${p.cameraDistance.toFixed(2)} | Obstructed: ${p.cameraObstructed}`;
    }, 250);
    return () => window.clearInterval(timer);
  }, [visible, runtime]);
  if (!visible) return null;
  return <aside className="player-debug hud-surface" aria-label="Player diagnostics">
    <div className="debug-heading"><strong>Player diagnostics</strong><button className="player-tool" onClick={() => useWorldDebugStore.getState().setVisible(false)} aria-label="Hide player diagnostics">Close</button></div>
    <output ref={output} aria-live="off">Preparing diagnostics…</output>
    <label><input type="checkbox" checked={colliders} onChange={(event) => useWorldDebugStore.getState().setColliders(event.target.checked)} />Collision wireframes</label>
    <p>Development only · 4 Hz metrics</p>
  </aside>;
}
