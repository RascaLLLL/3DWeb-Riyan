import { portfolio } from "@/data/portfolio";
import { skillCategories } from "@/data/portfolio/skills";
import type { SkillCategory } from "@/types/portfolio";
import { SkillIcon } from "./content-ui";

export function SkillWorkshop({ village = false }: { village?: boolean }) {
  return <div className="skill-workshop">{(Object.keys(skillCategories) as SkillCategory[]).map((category) => {
    const group = portfolio.skills.filter((skill) => skill.category === category), metadata = skillCategories[category];
    if (!group.length) return null;
    return <section key={category} className="skill-group"><div className="skill-group-heading"><SkillIcon reference={metadata.icon} /><div><h3>{metadata.title}</h3>{village && <p>{metadata.workshopLabel}</p>}</div></div>
      <ul>{group.map((skill) => <li key={skill.id}><div><strong>{skill.name}</strong>{skill.practice === "exploring" && <span className="exploring-label">Exploring</span>}</div>
        {skill.description && <p>{skill.description}</p>}{Boolean(skill.relatedTechnologies.length) && <p className="skill-related">Related: {skill.relatedTechnologies.join(" · ")}</p>}</li>)}</ul>
    </section>;
  })}<p className="portfolio-footnote">Skills and technologies are drawn from the public portfolio and project records. Exploring items are identified separately. No proficiency ratings are implied.</p></div>;
}
