"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => { dialog.close(); previousFocus?.focus(); };
  }, [open]);
  return <dialog ref={ref} className="modal panel" aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="modal-heading"><h2 id={titleId}>{title}</h2><Button onClick={onClose} className="button-small" aria-label="Close settings">Close</Button></div>
    {children}
  </dialog>;
}
