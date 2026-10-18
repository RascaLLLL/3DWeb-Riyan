"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { DialogueInput, DialogueNode } from "@/types/dialogue";

export function DialogueContent({ node, animate, closing, respond }: {
  node: DialogueNode; animate: boolean; closing: boolean; respond: (input: DialogueInput) => void;
}) {
  const [characters, setCharacters] = useState(0);
  const cursor = useRef(0);
  const typing = animate && characters < node.text.length;
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
    <p className="dialogue-text" aria-live="polite" aria-atomic="true">
      <span className="sr-only">{node.text}</span><span aria-hidden="true">{animate ? node.text.slice(0, characters) : node.text}</span>
    </p>
    {typing && Boolean(node.choices?.length) && <button className="dialogue-skip" onClick={showAll} disabled={closing}>Show all text</button>}
    <div className="dialogue-choices" aria-label="Your reply">
      {node.choices?.length ? node.choices.map((choice, index) => <Button className="dialogue-choice button-secondary" key={choice.id}
        disabled={closing} onClick={() => respond({ type: "choice", id: choice.id })}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{choice.label}</Button>)
        : <Button disabled={closing} onClick={() => typing ? showAll() : respond({ type: "continue" })}>
          {typing ? "Show all text" : node.next ? "Continue" : "Return to the village"}<span aria-hidden="true">→</span>
        </Button>}
    </div>
  </>;
}
