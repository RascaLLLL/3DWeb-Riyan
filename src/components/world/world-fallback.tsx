import { ButtonLink } from "@/components/ui/button";
export function WorldFallback() {
  return <div className="world-fallback"><div className="world-fallback-card" role="status"><p className="eyebrow">The direct path is always open</p><h2>3D is unavailable here</h2><p>Your browser couldn’t display this scene. All portfolio information is available in the HTML version.</p><nav className="fallback-actions" aria-label="Alternative routes"><ButtonLink href="/portfolio">Quick Portfolio</ButtonLink><ButtonLink href="/" className="button-secondary">Main menu</ButtonLink></nav></div></div>;
}
