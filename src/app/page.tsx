import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MedievalInterface } from "@/components/ui/medieval-interface";
import { SettingsButton } from "@/components/settings-button";
import { VillageMap } from "@/components/menu/village-map";

export default function Home() {
  return <MedievalInterface><header className="site-header"><Link className="wordmark" href="/" aria-label="The Village of Riyan home"><span className="crest" aria-hidden="true">R</span>RIYAN<span className="wordmark-detail">A personal world</span></Link><span className="edition">CHAPTER I · THE FOUNDATION</span></header>
    <main id="main-content" className="menu-layout">
      <section className="menu-copy" aria-labelledby="village-title"><p className="eyebrow"><span className="short-rule" />A little world. A personal story.</p><h1 id="village-title">The Village<br />of <em>Riyan</em><span className="title-period">.</span></h1><p className="menu-subtitle">An Interactive Medieval Portfolio</p><div className="ornament" aria-hidden="true">───── ◇ ─────</div><p className="intro">Every path has a story.<br />Welcome to a quieter corner of the web.</p>
      <nav className="menu-actions" aria-label="Main menu"><ButtonLink href="/world">Enter Village <span aria-hidden="true">→</span></ButtonLink><ButtonLink href="/portfolio" className="button-secondary">Quick Portfolio <span aria-hidden="true">↗</span></ButtonLink><SettingsButton /></nav>
      <p className="menu-note">Short on time? Take the direct path to the portfolio.</p></section>
      <figure className="map-frame"><div className="map-topline"><span>THE VILLAGE & ITS SURROUNDINGS</span><span>NO. 01</span></div><VillageMap /><figcaption><span className="map-caption-rule" />A place to begin<span className="map-caption-rule" /></figcaption><p className="map-disclaimer">Concept map · exploration arrives in future chapters</p></figure>
    </main>
    <footer className="menu-footer"><p><span className="status-dot" />Foundation preview <span className="footer-divider">/</span> Built with care, one chapter at a time.</p><p><kbd>Tab</kbd> to navigate <span className="footer-divider">·</span> <kbd>Enter</kbd> to choose</p></footer>
  </MedievalInterface>;
}

