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
  return <Modal open={Boolean(building)} title={presentation?.title ?? "Village building"} subtitle={presentation?.purpose} presentation="overlay" onClose={close}
    closeLabel="Close building panel" fallbackFocus={restoreFocus} className={`building-modal portfolio-building-modal ${phase === "closing" ? "is-closing" : ""}`}>
    {building && presentation && <>
      {building.id === "guild" && <p className="building-welcome">Choose a notice to explore a project and its story.</p>}
      <div className="building-content">{building.portfolioSections.map((sectionId) => {
        const section = portfolio.sections.find((entry) => entry.id === sectionId);
        return section && <section key={section.id} aria-labelledby={building.portfolioSections.length > 1 ? `building-${section.id}` : undefined} aria-label={building.portfolioSections.length === 1 ? section.title : undefined}>
          {building.portfolioSections.length > 1 && <h3 id={`building-${section.id}`}>{section.title}</h3>}
          {section.id === "projects" ? <GuildProjectBrowser /> : <PortfolioSectionContent section={section.id} village />}
        </section>;
      })}</div>
      <div className="building-actions"><Button onClick={close} disabled={phase === "closing"}>Return to village</Button>
        <ButtonLink href={building.portfolioHref} className="button-secondary">Read in Quick Portfolio <span aria-hidden="true">↗</span></ButtonLink></div>
      <p className="building-dismiss-hint">Escape to close · Your place in the village is kept</p>
    </>}
  </Modal>;
}
