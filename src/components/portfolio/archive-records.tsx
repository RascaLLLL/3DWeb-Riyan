import { portfolio } from "@/data/portfolio";
import { usablePortfolioLink } from "@/systems/portfolio/links";
import { ContentTodos, PublishedPeriod, TagList } from "./content-ui";

interface ArchiveHeadingProps { headingLevel?: 3 | 4 }

export function ExperienceTimeline({ headingLevel = 3 }: ArchiveHeadingProps = {}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return <><ol className="experience-timeline">{portfolio.experience.map((entry) => <li key={entry.id}><article>
    <div className="archive-heading"><Heading>{entry.role}</Heading><PublishedPeriod period={entry.dateRange} /></div><p className="archive-organization">{entry.organization}</p>
    <ul className="responsibilities">{entry.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
    <TagList tags={entry.technologies} />
    {entry.outcomes.length > 0 && <ul className="responsibilities">{entry.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>}
    <ContentTodos todos={entry.todos} />
  </article></li>)}</ol><p className="portfolio-footnote">Periods reflect the published portfolio snapshot. Exact months and documented outcomes remain TODO.</p></>;
}
export function EducationArchive({ headingLevel = 3 }: ArchiveHeadingProps = {}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return <div className="archive-records">{portfolio.education.map((entry) => <article key={entry.id}><div className="archive-heading"><Heading>{entry.studyProgram}</Heading><PublishedPeriod period={entry.dateRange} /></div>
    <p className="archive-organization">{entry.institution}</p>{entry.academicInformation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<ContentTodos todos={entry.todos} />
  </article>)}</div>;
}
export function CertificationArchive({ headingLevel = 3 }: ArchiveHeadingProps = {}) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  return <><ul className="certification-records">{portfolio.certifications.map((certificate) => {
    const href = usablePortfolioLink(certificate.credentialUrl);
    return <li key={certificate.id}><article><Heading>{certificate.title}</Heading><p className="archive-organization">{certificate.issuer}</p>
      {certificate.date && <p><time dateTime={certificate.date}>{certificate.date}</time></p>}
      {href && <a href={href} target="_blank" rel="noopener noreferrer">Verify credential <span aria-hidden="true">↗</span></a>}
      <ContentTodos todos={certificate.todos} />
    </article></li>;
  })}</ul><p className="portfolio-footnote">Titles and issuers are reproduced from the public portfolio. Issue dates and issuer verification links have not been supplied; no credential IDs are inferred.</p></>;
}
