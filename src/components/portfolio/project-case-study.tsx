import type { PortfolioProject } from "@/types/portfolio";
import { projectCategories } from "@/data/portfolio/projects";
import { usablePortfolioLink } from "@/systems/portfolio/links";
import { ContentTodos, TagList } from "./content-ui";
import { PortfolioMedia } from "./portfolio-media";

export function ProjectCaseStudy({ project, embedded = false }: { project: PortfolioProject; embedded?: boolean }) {
  const Title = embedded ? "h3" : "h1", Heading = embedded ? "h4" : "h2";
  const demo = usablePortfolioLink(project.liveDemoUrl), repository = usablePortfolioLink(project.repositoryUrl);
  const fields = [
    { title: "Challenge", value: project.problemStatement, missing: "Describe the original problem, intended users, and constraints." },
    { title: "Solution", value: project.solution, missing: "Describe the implemented approach." },
    { title: "My contribution", value: project.personalContribution, missing: "Specify your own responsibilities and collaborators." },
    { title: "Outcome", value: project.outcome, missing: "Add documented results or delivered functionality." },
  ];
  return <article className="project-case-study"><header><p className="eyebrow">{projectCategories[project.category]}</p><Title>{project.title}</Title><p className="case-introduction">{project.shortDescription}</p></header>
    <section className="project-gallery" aria-label="Project screenshot gallery"><Heading>Screenshot gallery</Heading>
      {project.screenshots.length ? project.screenshots.map((media) => <figure key={media.src}><PortfolioMedia media={media} /><figcaption>{media.caption} <a href={media.src} target="_blank" rel="noopener noreferrer">View full-size image <span aria-hidden="true">↗</span></a></figcaption></figure>)
        : <p className="content-todo"><strong>TODO:</strong> Add a genuine project screenshot. A stock illustration is not presented as the dashboard.</p>}
    </section>
    <div className="case-fields">{fields.map((field) => <section key={field.title}><Heading>{field.title}</Heading>{field.value ? <p>{field.value}</p> : <p className="content-todo"><strong>TODO:</strong> {field.missing}</p>}
      {field.title === "Outcome" && project.outcomeNote && <p className="portfolio-footnote">{project.outcomeNote}</p>}</section>)}</div>
    <section className="case-stack"><Heading>Tech stack</Heading><TagList tags={project.technologyStack} />{project.technicalNote && <p className="content-todo"><strong>Version to confirm:</strong> {project.technicalNote}</p>}</section>
    <div className="case-actions">{demo && <a className="button button-small" href={demo} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
      {repository && <a className="button button-secondary button-small" href={repository} target="_blank" rel="noopener noreferrer">Repository <span aria-hidden="true">↗</span></a>}
      {!demo && !repository && <p className="portfolio-footnote">Live demo and repository links are not published here because verified destinations have not been supplied.</p>}</div>
    <ContentTodos todos={project.todos} />
  </article>;
}
