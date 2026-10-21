import Link from "next/link";
import type { Metadata } from "next";
import { WorldClient } from "@/components/world/world-client";
import { ButtonLink } from "@/components/ui/button";
import { SettingsButton } from "@/components/settings-button";
import { MedievalInterface } from "@/components/ui/medieval-interface";
import { worldConfig } from "@/data/world";
import "../exploration.css";

export const metadata: Metadata = { title: "Explore the Village" };
export default function WorldPage() {
  return <MedievalInterface className="world-page">
    <header className="site-header">
      <Link className="wordmark" href="/"><span className="crest" aria-hidden="true">R</span>RIYAN</Link>
      <nav className="world-nav" aria-label="World navigation"><ButtonLink href="/portfolio" className="button-secondary">Quick Portfolio</ButtonLink><SettingsButton /></nav>
    </header>
    <main id="main-content">
      <div className="world-heading">
        <div><p className="eyebrow">Chapter VII · Paths and discoveries</p><h1>A resident for a day</h1></div>
        <ButtonLink href="/" className="button-secondary button-small">← Main menu</ButtonLink>
      </div>
      <div className="world-viewport" aria-label="Playable medieval village">
        <WorldClient />
        <noscript><div className="world-fallback">JavaScript is needed for 3D. The village directory below and <Link href="/portfolio">HTML portfolio</Link> remain available.</div></noscript>
      </div>
      <div className="world-description">
        <p><strong>Take a path of your own.</strong> Elder Alden waits near the well. Journal and Map above the village offer five optional discoveries. Every portfolio section is always available through the keepers or HTML directory below.</p>
        <p><kbd>WASD</kbd> / arrows · <kbd>Shift</kbd> run · <kbd>E</kbd> talk / interact nearby · <kbd>Esc</kbd> close / pause<br />Drag to look · Scroll to adjust camera distance · Touch controls on small screens</p>
      </div>
      <section className="village-directory" aria-labelledby="directory-heading">
        <div className="directory-heading"><p className="eyebrow">The village directory</p><h2 id="directory-heading">Know your way around</h2><p>Landmarks are numbered in the scene. These links open the corresponding HTML portfolio sections.</p></div>
        <ol className="landmark-list">{worldConfig.buildings.map((building, index) => <li key={building.id}>
          <span className="landmark-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div><h3><Link href={building.portfolioHref}>{building.name}<span aria-hidden="true"> ↗</span></Link></h3><p>{building.description}</p><span className="landmark-section">{building.portfolioSections.join(" & ")}</span></div>
        </li>)}</ol>
      </section>
    </main>
  </MedievalInterface>;
}


