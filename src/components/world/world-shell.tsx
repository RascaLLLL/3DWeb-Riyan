"use client";

import { useEffect, type ReactNode } from "react";
import { lockDocumentScroll } from "@/systems/ui/scroll-lock";

export function WorldShell({ children }: { children: ReactNode }) {
  useEffect(() => lockDocumentScroll(), []);
  return <main id="main-content" className="world-shell" tabIndex={-1} aria-label="Explore the Village of Riyan">
    <h1 className="sr-only">The Village of Riyan</h1>
    <div className="world-stage">{children}</div>
  </main>;
}
