import Link from "next/link";
import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { MedievalInterface } from "@/components/ui/medieval-interface";
import { PortfolioSectionContent } from "@/components/portfolio/portfolio-section-content";

export const metadata: Metadata = {
  title: `${portfolio.profile.name} — Developer Portfolio`, description: portfolio.profile.shortIntroduction,
  robots: { index: true, follow: true },
  openGraph: { title: `${portfolio.profile.name} — Developer Portfolio`, description: portfolio.profile.shortIntroduction, type: "website" },
};

export default function PortfolioPage() {
  return <MedievalInterface><header className="site-header"><Link className="wordmark" href="/"><span className="crest" aria-hidden="true">R</span>RIYAN</Link><ButtonLink href="/world" className="button-secondary button-small">Explore the village</ButtonLink></header>
    <main id="main-content" className="portfolio-content"><div className="portfolio-hero"><p className="eyebrow">The direct path · Developer portfolio</p><h1>{portfolio.profile.name}</h1><p className="portfolio-profession">{portfolio.profile.professionalTitle}</p><p className="intro">{portfolio.introduction}</p>
      <div className="portfolio-hero-actions"><Link className="button button-small" href="#projects">Browse projects <span aria-hidden="true">↓</span></Link><Link className="button button-secondary button-small" href="#contact">Get in touch <span aria-hidden="true">↓</span></Link></div>
      <p className="muted small">All important information is available here without 3D or WebGL.</p></div>
      <nav aria-label="Portfolio sections" className="portfolio-nav">{portfolio.sections.map((section) => <Link key={section.id} href={`#${section.id}`}>{section.title}</Link>)}</nav>
      <div className="portfolio-sections">{portfolio.sections.map((section) => <Panel className={`portfolio-section portfolio-section-${section.id}`} key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
        <SectionHeading eyebrow={section.location} id={`${section.id}-heading`}>{section.title}</SectionHeading><PortfolioSectionContent section={section.id} />
      </Panel>)}</div>
      <p className="portfolio-source-note">Content imported from <a href={portfolio.source.url} target="_blank" rel="noopener noreferrer">Riyan’s existing portfolio</a> on 21 October 2026. TODO notes distinguish missing details from published information.</p>
    </main><footer className="menu-footer"><p>The Village of Riyan · {portfolio.profile.name}</p><Link href="/">Back to the main menu</Link></footer></MedievalInterface>;
}

