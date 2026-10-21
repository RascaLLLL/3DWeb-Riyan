import type { PortfolioSectionId } from "@/types/world";
import { ProfileJournal } from "./profile-journal";
import { ProjectBoard } from "./project-board";
import { SkillWorkshop } from "./skill-workshop";
import { ExperienceTimeline, EducationArchive, CertificationArchive } from "./archive-records";
import { ContactResources } from "./contact-resources";

export function PortfolioSectionContent({ section, village = false }: { section: PortfolioSectionId; village?: boolean }) {
  switch (section) {
    case "about": return <ProfileJournal />;
    case "projects": return <ProjectBoard />;
    case "skills": return <SkillWorkshop village={village} />;
    case "experience": return <ExperienceTimeline headingLevel={village ? 4 : 3} />;
    case "education": return <EducationArchive headingLevel={village ? 4 : 3} />;
    case "certifications": return <CertificationArchive headingLevel={village ? 4 : 3} />;
    case "contact": return <ContactResources />;
  }
}
