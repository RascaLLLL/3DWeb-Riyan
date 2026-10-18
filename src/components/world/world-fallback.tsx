import { ButtonLink } from "@/components/ui/button";
export function WorldFallback() {
  return <div className="world-fallback" role="status"><p className="eyebrow">The direct path is always open</p><h2>3D is unavailable here</h2><p>Your browser couldn’t display this scene. All portfolio information is available in the HTML version.</p><ButtonLink href="/portfolio">Open Quick Portfolio →</ButtonLink></div>;
}
