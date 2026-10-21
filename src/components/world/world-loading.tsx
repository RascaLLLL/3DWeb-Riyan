import { LoadingIndicator } from "@/components/ui/loading-indicator";
import Link from "next/link";

export function WorldLoading({ label = "Opening the village…" }: { label?: string }) {
  return <div className="world-loading"><LoadingIndicator label={label} /><nav className="world-loading-routes" aria-label="Alternative routes while loading"><Link href="/">Main menu</Link><Link href="/portfolio">Quick Portfolio</Link></nav></div>;
}
