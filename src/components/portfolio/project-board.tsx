import Link from "next/link";
import { portfolio } from "@/data/portfolio";
import { projectCategories } from "@/data/portfolio/projects";
import { TagList } from "./content-ui";
import { PortfolioMedia } from "./portfolio-media";

export function ProjectBoard({ onSelectProject, featuredOnly = false }: { onSelectProject?: (id: string) => void; featuredOnly?: boolean }) {
  const records = portfolio.projects.filter((project) => !featuredOnly || project.featured);
  return <div className={`project-board ${onSelectProject ? "guild-board" : ""}`}>{records.map((project, index) => <article key={project.id} className="project-record" aria-labelledby={`project-card-${project.id}`}>
    <div className="project-record-image">{project.screenshots[0] ? <PortfolioMedia media={project.screenshots[0]} /> : <div className="missing-project-image"><span className="record-seal" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>TODO: genuine project screenshot</p></div>}</div>
    <div className="project-record-body"><p className="eyebrow">{projectCategories[project.category]}</p><h3 id={`project-card-${project.id}`}>{project.title}</h3><p>{project.shortDescription}</p><TagList tags={project.technologyStack} />
      {onSelectProject ? <button className="button button-secondary button-small" data-project-id={project.id} onClick={() => onSelectProject(project.id)}>Open guild record <span aria-hidden="true">→</span></button>
        : <Link className="button button-secondary button-small" href={`/portfolio/projects/${project.id}`}>Read case study <span aria-hidden="true">→</span></Link>}
    </div>
  </article>)}</div>;
}
