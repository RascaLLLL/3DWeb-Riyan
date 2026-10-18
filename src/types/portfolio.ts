import type { PortfolioSectionId } from "./world";

export interface PortfolioSection { id: PortfolioSectionId; title: string; location: string; description: string; }

export interface SocialProfile { label: string; href: string }
export interface CvDownload { href: `/assets/${string}`; fileName: string }
export interface PortfolioContact { email: string | null; socialProfiles: SocialProfile[]; cv: CvDownload | null }
