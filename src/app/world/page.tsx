import Link from "next/link";
import type { Metadata } from "next";
import { WorldClient } from "@/components/world/world-client";

export const metadata: Metadata = { title: "Explore the Village" };

export default function WorldPage() {
  return <>
    <WorldClient />
    <noscript><div className="world-noscript"><div className="world-fallback-card">
      <p className="eyebrow">The direct path is always open</p>
      <h2>Explore the portfolio</h2>
      <p>JavaScript is needed to enter the 3D village. All portfolio information is available in the HTML version.</p>
      <nav className="fallback-actions" aria-label="Alternative routes"><Link className="button" href="/portfolio">Quick Portfolio</Link><Link className="button button-secondary" href="/">Main menu</Link></nav>
    </div></div></noscript>
  </>;
}
