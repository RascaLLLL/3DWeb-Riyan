"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";

export function Modal({ open, onClose, onAfterClose, title, children, className = "", closeLabel = "Close settings" }: {
  open: boolean; onClose: () => void; onAfterClose?: () => void; title: string;
  children: ReactNode; className?: string; closeLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => {
      dialog.close();
      // A dialogue may hand off to a portfolio dialog without returning to the canvas.
      if (!document.querySelector("dialog[open]")) { previousFocus?.focus(); onAfterClose?.(); }
    };
  }, [open, onAfterClose]);
  return <dialog ref={ref} className={`modal panel ${className}`} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="modal-heading"><h2 id={titleId}>{title}</h2><Button onClick={onClose} className="button-small" aria-label={closeLabel}>Close</Button></div>
    {children}
  </dialog>;
}
