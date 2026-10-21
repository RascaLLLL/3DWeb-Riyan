import type { PersonalProfile } from "@/types/portfolio";
import { contact } from "./contact";
import { portfolioSource } from "./source";

export const profile: PersonalProfile = {
  name: "Riyandi Heri Pitono",
  displayName: "Riyan",
  professionalTitle: "Information Technology Student & Web Developer",
  shortIntroduction: "Information Technology student at Telkom University, working with web development, machine learning, databases, and cloud fundamentals.",
  detailedIntroduction: [
    "I’m an Information Technology student at Telkom University with hands-on experience in web development, machine learning, databases, and cloud computing.",
    "I enjoy turning ideas into digital products while learning modern technologies. My focus is on clean user experiences supported by sound engineering practices.",
  ],
  location: null,
  portrait: { src: "/assets/portfolio/profile.png", alt: "Riyan’s portrait, published on his existing portfolio", width: 1086, height: 981,
    caption: "Portrait from the existing portfolio.", sourceUrl: "https://heyriyan.vercel.app/Riyan.png" },
  resumeUrl: contact.cv,
  socialLinks: contact.socialProfiles,
  source: portfolioSource,
  todos: [
    { field: "location", message: "Add a location only if it is intended for public display." },
    { field: "resumeUrl", message: "Supply an approved CV document or verified resume URL." },
  ],
};
