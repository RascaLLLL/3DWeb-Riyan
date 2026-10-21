"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";
import { InterfaceIcon } from "./interface-icon";
import { mountModal } from "@/systems/ui/modal-lifecycle";

export function Modal({ open, onClose, fallbackFocus, title, subtitle, leading, presentation = "document", children, className = "", closeLabel = "Close settings" }: {
  open: boolean; onClose: () => void; fallbackFocus?: () => void; title: string;
  children: ReactNode; className?: string; closeLabel?: string; subtitle?: string;
  leading?: ReactNode; presentation?: "document" | "overlay" | "dialogue";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const subtitleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    return mountModal(dialog, heading.current, fallbackFocus);
  }, [open, fallbackFocus]);
  return <dialog ref={ref} className={`modal panel ${presentation !== "document" ? "world-overlay" : ""} ${presentation === "dialogue" ? "world-dialogue" : ""} ${className}`} aria-labelledby={titleId} aria-describedby={subtitle ? subtitleId : undefined}
    onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose(); }}>
    <div className="modal-heading">{leading}<div className="modal-title"><h2 id={titleId} ref={heading} tabIndex={-1}>{title}</h2>{subtitle && <p id={subtitleId} className="modal-subtitle">{subtitle}</p>}</div><Button onClick={onClose} className="button-secondary button-small modal-close" aria-label={closeLabel}><InterfaceIcon name="close" /><span>Close</span></Button></div>
    <div className="modal-body">{children}</div>
  </dialog>;
}
