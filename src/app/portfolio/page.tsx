import Link from "next/link";
import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { MedievalInterface } from "@/components/ui/medieval-interface";
import { ContactResources } from "@/components/portfolio/contact-resources";

export const metadata: Metadata = { title: "Quick Portfolio" };

export default function PortfolioPage() {
  return <MedievalInterface><header className="site-header"><Link className="wordmark" href="/"><span className="crest" aria-hidden="true">R</span>RIYAN</Link><ButtonLink href="/" className="button-secondary button-small">Back to the menu</ButtonLink></header>
    <main id="main-content" className="portfolio-content"><p className="eyebrow">The direct path</p><h1>{portfolio.name}’s portfolio</h1><p className="intro">{portfolio.introduction}</p><p className="muted">All portfolio information lives here too. No 3D or WebGL required.</p>
      <nav aria-label="Portfolio sections" className="portfolio-nav">{portfolio.sections.map((section) => <Link key={section.id} href={`#${section.id}`}>{section.title}</Link>)}</nav>
      <div className="portfolio-grid">{portfolio.sections.map((section) => <Panel key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}><SectionHeading eyebrow={section.location} id={`${section.id}-heading`}>{section.title}</SectionHeading><p>{section.description}</p>{section.id === "contact" && <ContactResources />}<span className="content-status">Awaiting portfolio content</span></Panel>)}</div>
    </main><footer className="menu-footer"><p>The Village of Riyan</p><p>Personal portfolio · Foundation edition</p></footer></MedievalInterface>;
}

