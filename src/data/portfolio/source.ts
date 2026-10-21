import type { ContentSource } from "@/types/portfolio";

export const portfolioSource: ContentSource = { url: "https://heyriyan.vercel.app/", retrievedOn: "2026-10-21" };
export const sourceComponent = (file: string): ContentSource => ({
  url: `https://github.com/RascaLLLL/personalweb-riyan/blob/main/src/components/${file}.tsx`,
  retrievedOn: portfolioSource.retrievedOn,
});
