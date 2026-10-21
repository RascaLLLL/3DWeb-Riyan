"use client";

import { useEffect } from "react";
import { useInteractionStore } from "@/stores/interaction-store";
import { useGameStore } from "@/stores/game-store";
import { buildingPresentations, interactionConfig } from "@/data/building-interactions";
import { worldConfig } from "@/data/world";
import { portfolio } from "@/data/portfolio";
import { Modal } from "@/components/ui/modal";
import { Button, ButtonLink } from "@/components/ui/button";
import { PortfolioSectionContent } from "@/components/portfolio/portfolio-section-content";
import { GuildProjectBrowser } from "./guild-project-browser";

export function BuildingPanelManager({ restoreFocus }: { restoreFocus: () => void }) {
  const id = useInteractionStore((state) => state.buildingId);
  const phase = useInteractionStore((state) => state.phase);
  const close = useInteractionStore((state) => state.beginClose);
  const reducedMotion = useGameStore((state) => state.playerPreferences.reducedMotion);
  useEffect(() => {
    if (phase !== "closing") return;
    const delay = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : interactionConfig.closeDurationMs;
    const timer = window.setTimeout(() => useInteractionStore.getState().finishClose(performance.now()), delay);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);
  const building = worldConfig.buildings.find((entry) => entry.id === id);
  const presentation = id ? buildingPresentations[id] : null;
  return <Modal open={Boolean(building)} title={presentation?.title ?? "Village building"} onClose={close}
    closeLabel="Close building panel" onAfterClose={restoreFocus} className={`building-modal portfolio-building-modal ${phase === "closing" ? "is-closing" : ""}`}>
    {building && presentation && <>
      <p className="eyebrow building-purpose">{presentation.purpose}</p>
      <p className="building-welcome">{building.id === "guild" ? "Choose a notice on the quest board to read its real project record." : "A quiet place to explore the developer’s records."} Your place in the village is kept while you read.</p>
      <div className="building-content">{building.portfolioSections.map((sectionId) => {
        const section = portfolio.sections.find((entry) => entry.id === sectionId);
        return section && <section key={section.id} aria-labelledby={`building-${section.id}`}>
          <h3 id={`building-${section.id}`}>{section.id === "projects" ? "The project quest board" : section.title}</h3>
          {section.id === "projects" ? <GuildProjectBrowser /> : <PortfolioSectionContent section={section.id} village />}
        </section>;
      })}</div>
      <p className="building-content-note">Records come from the existing portfolio. Missing or conflicting details are marked TODO.</p>
      <div className="building-actions"><Button onClick={close} disabled={phase === "closing"}>Return to exploration</Button>
        <ButtonLink href={building.portfolioHref} className="button-secondary">Read in Quick Portfolio <span aria-hidden="true">↗</span></ButtonLink></div>
      <p className="building-dismiss-hint">Escape closes this panel. You’ll return to the same spot.</p>
    </>}
  </Modal>;
}
