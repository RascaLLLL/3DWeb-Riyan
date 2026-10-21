"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { DialogueInput, DialogueNode } from "@/types/dialogue";

export function DialogueContent({ node, animate, closing, respond }: {
  node: DialogueNode; animate: boolean; closing: boolean; respond: (input: DialogueInput) => void;
}) {
  const [characters, setCharacters] = useState(0);
  const cursor = useRef(0);
  const text = useRef<HTMLParagraphElement>(null);
  const typing = animate && characters < node.text.length;
  useEffect(() => {
    // A keyed branch replaces the focused reply; keep keyboard focus in the new turn.
    // Initial opening remains owned by the modal's NPC heading focus.
    if (text.current?.closest("dialog[open]")) text.current.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!animate) return;
    const timer = window.setInterval(() => {
      cursor.current = Math.min(node.text.length, cursor.current + 2);
      setCharacters(cursor.current);
      if (cursor.current === node.text.length) window.clearInterval(timer);
    }, 32);
    return () => window.clearInterval(timer);
  }, [node.text, animate]);
  const showAll = () => { cursor.current = node.text.length; setCharacters(node.text.length); };
  return <>
    <p ref={text} className="dialogue-text" tabIndex={-1}>
      <span className="sr-only">{node.text}</span>
      <span className="dialogue-text-space" aria-hidden="true">{node.text}</span>
      <span className="dialogue-text-reveal" aria-hidden="true">{animate ? node.text.slice(0, characters) : node.text}</span>
    </p>
    {animate && Boolean(node.choices?.length) && <button className="dialogue-skip" onClick={() => { if (typing) showAll(); }}
      aria-disabled={!typing || closing} tabIndex={typing ? 0 : -1} disabled={closing}>{typing ? "Show all text" : "Text shown"}</button>}
    <div className="dialogue-choices" aria-label="Your reply">
      {node.choices?.length ? node.choices.map((choice) => <Button className={`dialogue-choice button-secondary ${choice.action?.type === "open-panel" ? "is-destination" : ""}`} key={choice.id}
        disabled={closing} onClick={() => respond({ type: "choice", id: choice.id })}>{choice.label}</Button>)
        : <Button disabled={closing} onClick={() => typing ? showAll() : respond({ type: "continue" })}>
          {typing ? "Show all text" : node.next ? "Continue" : "Return to the village"}<span aria-hidden="true">→</span>
        </Button>}
    </div>
  </>;
}
