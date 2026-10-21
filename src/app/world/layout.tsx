import type { ReactNode } from "react";
import type { Viewport } from "next";
import { WorldShell } from "@/components/world/world-shell";
// World presentation is owned by this route, outside the portfolio document layout.
import "../styles/world.css";
import "../exploration.css";
import "./overlays.css";

export const viewport: Viewport = { viewportFit: "cover", themeColor: "#becbc1" };

export default function WorldLayout({ children }: { children: ReactNode }) {
  return <WorldShell>{children}</WorldShell>;
}
