import type { PortfolioContact } from "@/types/portfolio";
import { portfolioSource } from "./source";

export const contact: PortfolioContact = {
  email: "hpitono24@gmail.com",
  socialProfiles: [
    { id: "github", label: "GitHub", href: "https://github.com/RascaLLLL", verification: "reachable", sourceUrl: portfolioSource.url, checkedOn: portfolioSource.retrievedOn },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/riyandi-heri-p-311166331/", verification: "published-on-source", sourceUrl: portfolioSource.url, checkedOn: portfolioSource.retrievedOn,
      note: "Published on the owner’s portfolio. LinkedIn blocks automated availability checks (HTTP 999)." },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/riyanhrp_/", verification: "reachable", sourceUrl: portfolioSource.url, checkedOn: portfolioSource.retrievedOn },
  ],
  cv: null,
};
