import type { PortfolioSection } from "@/types/portfolio";

// Replace these explicit empty states with Riyan's approved information.
export const portfolio = {
  name: "Riyan",
  introduction: "Welcome to my personal portfolio. This space is taking shape alongside the village.",
  sections: [
    { id: "projects", title: "Projects", location: "The guild board", description: "Project details and verified project links have not been added yet." },
    { id: "skills", title: "Skills", location: "The blacksmith", description: "Riyan’s skills and areas of expertise have not been added yet." },
    { id: "experience", title: "Experience", location: "The library", description: "Professional experience has not been added yet." },
    { id: "education", title: "Education", location: "The library", description: "Education details have not been added yet." },
    { id: "contact", title: "Contact", location: "The village gate", description: "Contact information and social links have not been provided yet." },
  ] satisfies PortfolioSection[],
};
