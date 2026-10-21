import type { PortfolioSectionId } from "./world";

export interface PortfolioSection { id: PortfolioSectionId; title: string; location: string; description: string; }

export interface ContentSource { url: string; retrievedOn: string }
export interface ContentTodo { field: string; message: string }
export interface VerifiedLink {
  href: string;
  sourceUrl: string;
  checkedOn: string;
  verification: "reachable" | "published-on-source";
  note?: string;
}
export interface PortfolioImage {
  src: `/assets/portfolio/${string}`;
  alt: string;
  width: number;
  height: number;
  caption: string;
  sourceUrl: string;
}
export interface SocialProfile extends VerifiedLink { id: string; label: string }
export interface CvDownload extends VerifiedLink { fileName?: string }
export interface PortfolioContact { email: string | null; socialProfiles: SocialProfile[]; cv: CvDownload | null }

export interface PersonalProfile {
  name: string;
  displayName: string;
  professionalTitle: string;
  shortIntroduction: string;
  detailedIntroduction: string[];
  location: string | null;
  portrait: PortfolioImage | null;
  resumeUrl: CvDownload | null;
  socialLinks: SocialProfile[];
  source: ContentSource;
  todos: ContentTodo[];
}
export type SkillCategory = "languages" | "frontend" | "backend" | "databases" | "cloud" | "tools" | "other";
export type SkillIconReference = "code" | "interface" | "server" | "database" | "cloud" | "tools" | "research";
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  relatedTechnologies: string[];
  iconReference: SkillIconReference;
  description: string | null;
  practice: "listed" | "exploring";
  source: ContentSource;
}
export type ProjectCategory = "game-development" | "machine-learning" | "web-application" | "iot" | "business-website";
export interface PortfolioProject {
  id: string;
  title: string;
  shortDescription: string;
  problemStatement: string | null;
  solution: string;
  personalContribution: string | null;
  technologyStack: string[];
  outcome: string | null;
  outcomeNote: string | null;
  screenshots: PortfolioImage[];
  liveDemoUrl: VerifiedLink | null;
  repositoryUrl: VerifiedLink | null;
  category: ProjectCategory;
  featured: boolean;
  technicalNote: string | null;
  source: ContentSource;
  todos: ContentTodo[];
}
export interface PortfolioDateRange { start: string | null; end: string | null; ongoing: boolean }
export interface WorkExperience {
  id: string;
  role: string;
  organization: string;
  dateRange: PortfolioDateRange;
  responsibilities: string[];
  outcomes: string[];
  technologies: string[];
  source: ContentSource;
  todos: ContentTodo[];
}
export interface Education {
  id: string;
  institution: string;
  studyProgram: string;
  dateRange: PortfolioDateRange;
  academicInformation: string[];
  source: ContentSource;
  todos: ContentTodo[];
}
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string | null;
  credentialUrl: VerifiedLink | null;
  source: ContentSource;
  todos: ContentTodo[];
}
