import type { Skill, SkillCategory, SkillIconReference } from "@/types/portfolio";
import { sourceComponent } from "./source";

export const skillCategories: Record<SkillCategory, { title: string; workshopLabel: string; icon: SkillIconReference }> = {
  languages: { title: "Languages", workshopLabel: "Core materials", icon: "code" },
  frontend: { title: "Frontend", workshopLabel: "Interface crafting tools", icon: "interface" },
  backend: { title: "Backend", workshopLabel: "Application foundations", icon: "server" },
  databases: { title: "Databases", workshopLabel: "Data stores", icon: "database" },
  cloud: { title: "Cloud", workshopLabel: "Cloud foundations", icon: "cloud" },
  tools: { title: "Tools", workshopLabel: "Workshop equipment", icon: "tools" },
  other: { title: "Other expertise", workshopLabel: "Other crafts & working skills", icon: "research" },
};

function skill(id: string, name: string, category: SkillCategory, relatedTechnologies: string[], file: string,
  description: string | null = null, practice: Skill["practice"] = "listed"): Skill {
  return { id, name, category, relatedTechnologies, iconReference: skillCategories[category].icon, description, practice, source: sourceComponent(file) };
}
// A listed technology is not a proficiency rating. Exploring items retain that distinction.
export const skills: Skill[] = [
  skill("python", "Python", "languages", ["Scikit-Learn", "Pandas"], "Skills"),
  skill("typescript", "TypeScript", "languages", ["React", "Next.js"], "TechStack"),
  skill("javascript", "JavaScript", "languages", ["React", "Chart.js"], "Experience"),
  skill("lua", "Lua", "languages", ["Roblox Studio"], "Experience"),
  skill("react", "React", "frontend", ["Next.js", "TypeScript"], "TechStack"),
  skill("nextjs", "Next.js", "frontend", ["React"], "TechStack"),
  skill("tailwind", "Tailwind CSS", "frontend", ["HTML", "React"], "TechStack"),
  skill("html-css", "HTML & CSS", "frontend", ["JavaScript"], "Experience", "Markup, styling, and responsive page layouts."),
  skill("chartjs", "Chart.js", "frontend", ["ESP32", "Firebase"], "Projects", "Listed in the IoT Monitoring Dashboard stack."),
  skill("nodejs", "Node.js", "backend", ["JavaScript"], "TechStack"),
  skill("firebase", "Firebase", "databases", ["JavaScript", "ESP32"], "Projects", "Listed in the learning platform and monitoring dashboard. Specific Firebase products are not specified."),
  skill("database-systems", "Database Systems", "databases", [], "Education", "An area of academic study; no database engine or proficiency level is inferred."),
  skill("aws", "AWS fundamentals", "cloud", [], "Skills", "The original portfolio lists AWS Basics."),
  skill("figma", "Figma", "tools", [], "TechStack"),
  skill("roblox-studio", "Roblox Studio", "tools", ["Lua"], "Experience"),
  skill("machine-learning", "Machine Learning", "other", ["Python", "Scikit-Learn", "Pandas"], "Skills"),
  skill("esp32", "ESP32", "other", ["Firebase", "Chart.js"], "Projects", "Listed in the IoT monitoring project."),
  skill("adaptability", "Adaptability", "other", [], "Skills"),
  skill("problem-solving", "Problem Solving", "other", [], "Skills"),
  skill("communication", "Communication", "other", [], "Skills"),
  skill("framer-motion", "Framer Motion", "frontend", [], "CurrentlyLearning", null, "exploring"),
  skill("docker", "Docker", "tools", [], "CurrentlyLearning", null, "exploring"),
  skill("cloud-exploration", "Cloud Computing", "cloud", [], "CurrentlyLearning", null, "exploring"),
];
