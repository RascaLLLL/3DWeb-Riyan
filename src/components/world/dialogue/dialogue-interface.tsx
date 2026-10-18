"use client";

import { useEffect, useState } from "react";
import { dialogues } from "@/data/dialogues";
import { npcsById } from "@/data/npcs";
import { buildingPresentations, interactionConfig } from "@/data/building-interactions";
import { discoveryObjectives } from "@/data/discoveries";
import { useDialogueStore } from "@/stores/dialogue-store";
import { useGuidanceStore } from "@/stores/guidance-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Modal } from "@/components/ui/modal";
import { NpcPortrait } from "./npc-portrait";
import { DialogueContent } from "./dialogue-content";

export function DialogueInterface({ restoreFocus }: { restoreFocus: () => void }) {
  const session = useDialogueStore((state) => state.session);
  const phase = useDialogueStore((state) => state.phase);
  const error = useDialogueStore((state) => state.error);
  const close = useDialogueStore((state) => state.beginClose);
  const respond = useDialogueStore((state) => state.respond);
  const destination = useGuidanceStore((state) => state.destination);
  const discoveries = useGuidanceStore((state) => state.completedObjectives);
  const quiet = useReducedMotion();
  const [animateText, setAnimateText] = useState(true);
  useEffect(() => {
    if (phase !== "closing") return;
    const timer = window.setTimeout(() => useDialogueStore.getState().finishClose(performance.now()), quiet ? 0 : interactionConfig.closeDurationMs);
    return () => window.clearTimeout(timer);
  }, [phase, quiet]);
  const npc = session ? npcsById[session.npcId] : null;
  const node = session ? dialogues[session.treeId]?.nodes[session.nodeId] : null;
  return <>
    <Modal open={Boolean(session)} title={npc?.displayName ?? "Village conversation"} onClose={close}
      closeLabel="End conversation" onAfterClose={restoreFocus} className={`building-modal dialogue-modal ${phase === "closing" ? "is-closing" : ""}`}>
      {session && (!npc || !node) && <p role="alert">This conversation record is unavailable. End the conversation to return to the village.</p>}
      {npc && node && session && <>
        <div className="dialogue-speaker"><NpcPortrait npc={npc} expression={node.expression} /><div><p className="eyebrow">{npc.role}</p><p>A moment in the village</p>
          {npc.id === "alden" && discoveries.includes("meet-guide") && <small>Discovery noted: {discoveryObjectives["meet-guide"]}</small>}</div></div>
        {error && <p role="alert">{error} You can always end the conversation.</p>}
        <DialogueContent key={`${session.treeId}:${session.nodeId}:${session.turn}`} node={node} animate={animateText && !quiet} closing={phase === "closing"} respond={respond} />
        {destination && <p className="dialogue-guidance" role="status">Path marked: <strong>{buildingPresentations[destination].title}</strong>. Follow the highlighted landmark when you return.</p>}
        <div className="dialogue-footer"><label><input type="checkbox" checked={animateText && !quiet} disabled={quiet} onChange={(event) => setAnimateText(event.target.checked)} />{quiet ? "Text shown instantly with reduced motion" : "Reveal text gradually"}</label>
          <span>Tab to choose · Enter / Space to select · Escape to leave</span></div>
      </>}
    </Modal>
    {!session && error && <div className="dialogue-error" role="alert"><p>{error} Exploration is still available.</p><button className="player-tool" onClick={() => useDialogueStore.getState().reset()}>Dismiss</button></div>}
  </>;
}
