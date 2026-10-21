import type { VerifiedLink } from "@/types/portfolio";

/** No source placeholder, unsafe protocol, or unverified URL becomes an action. */
export function usablePortfolioLink(link: VerifiedLink | null): string | null {
  if (!link || !link.sourceUrl || !link.checkedOn || !["reachable", "published-on-source"].includes(link.verification)) return null;
  if (link.href.startsWith("/assets/") && !link.href.includes("..") && !/[\\?#]/.test(link.href)) return link.href;
  try {
    const url = new URL(link.href);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash && url.hostname !== "example.com" ? url.href : null;
  } catch { return null; }
}
