import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MedievalInterface } from "@/components/ui/medieval-interface";
import { SettingsButton } from "@/components/settings-button";
import { VillageMap } from "@/components/menu/village-map";
import { VillageEntryLink } from "@/components/menu/village-entry-link";

export default function Home() {
  return <MedievalInterface className="menu-page"><header className="site-header"><Link className="wordmark" href="/" aria-label="The Village of Riyan home"><span className="crest" aria-hidden="true">R</span>RIYAN<span className="wordmark-detail">A personal world</span></Link><span className="edition">An open invitation</span></header>
    <main id="main-content" className="menu-layout">
      <section className="menu-copy" aria-labelledby="village-title"><p className="eyebrow"><span className="short-rule" />A little world. A personal story.</p><h1 id="village-title"><span className="title-prelude">The Village</span><span className="title-name">of <em>Riyan</em></span></h1><p className="menu-subtitle">An Interactive Medieval Portfolio</p><div className="ornament" aria-hidden="true"><span />◇<span /></div><p className="intro">Follow the cobblestones. Meet the villagers.<br />Discover the work and story behind each door.</p>
      <nav className="menu-actions" aria-label="Main menu"><VillageEntryLink /><ButtonLink href="/portfolio" className="button-secondary">Quick Portfolio <span aria-hidden="true">↗</span></ButtonLink><SettingsButton /></nav>
      <p className="menu-note">Short on time? Take the direct path to the portfolio.</p></section>
      <figure className="map-frame"><div className="map-topline"><span>The village & its surroundings</span><span>No. 01</span></div><VillageMap /><figcaption><span className="map-caption-rule" />A place to begin<span className="map-caption-rule" /></figcaption><p className="map-disclaimer">An illustrated keepsake · your live map awaits inside</p></figure>
    </main>
    <footer className="menu-footer"><p><span className="status-dot" />A village to explore. A portfolio to discover.</p><p><kbd>Tab</kbd> to navigate <span className="footer-divider">·</span> <kbd>Enter</kbd> to choose</p></footer>
  </MedievalInterface>;
}

