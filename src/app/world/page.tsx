import Link from "next/link";
import type { Metadata } from "next";
import { WorldClient } from "@/components/world/world-client";
import { ButtonLink } from "@/components/ui/button";
import { SettingsButton } from "@/components/settings-button";
import { MedievalInterface } from "@/components/ui/medieval-interface";

export const metadata: Metadata = { title: "Village Clearing" };
export default function WorldPage() {
  return <MedievalInterface className="world-page"><header className="site-header"><Link className="wordmark" href="/"><span className="crest" aria-hidden="true">R</span>RIYAN</Link><nav className="world-nav" aria-label="World navigation"><ButtonLink href="/portfolio" className="button-secondary">Quick Portfolio</ButtonLink><SettingsButton /></nav></header>
    <main id="main-content"><div className="world-heading"><div><p className="eyebrow">Chapter I · Rendering preview</p><h1>The village clearing</h1></div><ButtonLink href="/" className="button-secondary button-small">← Main menu</ButtonLink></div><div className="world-viewport" aria-label="3D rendering preview"><WorldClient /><noscript><div className="world-fallback">JavaScript is needed for 3D. <Link href="/portfolio">Read the complete HTML portfolio.</Link></div></noscript></div>
    <div className="world-description"><p><strong>A first foothold.</strong> Ground, sunlight, and a resident marker. Walking and village interactions arrive in later phases.</p><p>Drag to orbit · Scroll or pinch to zoom<br />Use the HTML navigation with <kbd>Tab</kbd> and <kbd>Enter</kbd>.</p></div></main>
  </MedievalInterface>;
}


