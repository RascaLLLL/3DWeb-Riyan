import { portfolio } from "../portfolio";
import type { ContentTodo } from "@/types/portfolio";
import type { PortfolioSectionId } from "@/types/world";

interface MissingContentRecord { section: PortfolioSectionId; record: string; todos: ContentTodo[] }
export const missingPortfolioContent: MissingContentRecord[] = [
  { section: "about", record: portfolio.profile.name, todos: portfolio.profile.todos },
  ...portfolio.projects.map((project) => ({ section: "projects" as const, record: project.title, todos: project.todos })),
  ...portfolio.experience.map((entry) => ({ section: "experience" as const, record: `${entry.role} — ${entry.organization}`, todos: entry.todos })),
  ...portfolio.education.map((entry) => ({ section: "education" as const, record: entry.institution, todos: entry.todos })),
  ...portfolio.certifications.map((entry) => ({ section: "certifications" as const, record: entry.title, todos: entry.todos })),
];
