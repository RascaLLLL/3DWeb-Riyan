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
    case "experience": return <ExperienceTimeline />;
    case "education": return <EducationArchive />;
    case "certifications": return <CertificationArchive />;
    case "contact": return <ContactResources />;
  }
}
