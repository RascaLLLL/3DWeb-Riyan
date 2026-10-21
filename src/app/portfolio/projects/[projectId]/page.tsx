import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, portfolio } from "@/data/portfolio";
import { MedievalInterface } from "@/components/ui/medieval-interface";
import { ProjectCaseStudy } from "@/components/portfolio/project-case-study";

export const dynamicParams = false;
export function generateStaticParams() { return portfolio.projects.map((project) => ({ projectId: project.id })); }
type Props = { params: Promise<{ projectId: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).projectId);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return { title: project.title, description: project.shortDescription, robots: { index: true, follow: true }, openGraph: { title: project.title, description: project.shortDescription, type: "article" } };
}
export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).projectId);
  if (!project) notFound();
  return <MedievalInterface><header className="site-header"><Link className="wordmark" href="/"><span className="crest" aria-hidden="true">R</span>RIYAN</Link><Link className="button button-secondary button-small" href="/portfolio#projects">← All projects</Link></header>
    <main id="main-content" className="project-page"><p className="case-breadcrumb"><Link href="/portfolio">Portfolio</Link> / <Link href="/portfolio#projects">Projects</Link></p>
      <ProjectCaseStudy project={project} />
      <footer className="case-study-footer"><p>Project record from <a href={`${portfolio.source.url}#projects`} target="_blank" rel="noopener noreferrer">the existing portfolio</a>. Missing details are explicitly marked TODO.</p><Link href="/portfolio#contact">Contact {portfolio.name} →</Link></footer>
    </main></MedievalInterface>;
}
