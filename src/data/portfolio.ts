import type { PortfolioSection } from "@/types/portfolio";
import { profile } from "./portfolio/profile";
import { contact } from "./portfolio/contact";
import { skills } from "./portfolio/skills";
import { projects } from "./portfolio/projects";
import { experience } from "./portfolio/experience";
import { education } from "./portfolio/education";
import { certifications } from "./portfolio/certifications";
import { portfolioSource } from "./portfolio/source";

// One shared content boundary for both the world and server-rendered portfolio.
export const portfolio = {
  name: profile.displayName,
  introduction: profile.shortIntroduction,
  profile, contact, skills, projects, experience, education, certifications, source: portfolioSource,
  sections: [
    { id: "about", title: "About Me", location: "The cottage journal", description: "Developer identity and personal introduction." },
    { id: "projects", title: "Projects", location: "The guild records", description: "Real projects from the existing portfolio, with case studies and clearly marked missing details." },
    { id: "skills", title: "Skills", location: "The blacksmith’s workshop", description: "Technical tools, foundations, and areas currently being explored." },
    { id: "experience", title: "Experience", location: "The library archives", description: "Work roles and responsibilities published on the existing portfolio." },
    { id: "education", title: "Education", location: "The academic shelves", description: "Current study and academic focus areas." },
    { id: "certifications", title: "Certifications", location: "The certificate archive", description: "Published certificate titles and issuers. Verification links remain TODO." },
    { id: "contact", title: "Contact", location: "The village gate", description: "Public contact channels from the existing portfolio. Email works through your mail application." },
  ] satisfies PortfolioSection[],
};

export const getProject = (id: string) => portfolio.projects.find((project) => project.id === id);
