"use client";

import { useEffect } from "react";
import { useInteractionStore } from "@/stores/interaction-store";
import { useGameStore } from "@/stores/game-store";
import { buildingPresentations, interactionConfig } from "@/data/building-interactions";
import { worldConfig } from "@/data/world";
import { portfolio } from "@/data/portfolio";
import { Modal } from "@/components/ui/modal";
import { Button, ButtonLink } from "@/components/ui/button";
import { ContactResources } from "@/components/portfolio/contact-resources";

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
    closeLabel="Close building panel" onAfterClose={restoreFocus} className={`building-modal ${phase === "closing" ? "is-closing" : ""}`}>
    {building && presentation && <>
      <p className="eyebrow building-purpose">{presentation.purpose}</p>
      <p className="building-welcome">A quiet place to discover {presentation.purpose.toLowerCase()}. Your place in the village is saved while you read.</p>
      <div className="building-content">{building.portfolioSections.map((sectionId) => {
        const section = portfolio.sections.find((entry) => entry.id === sectionId);
        return section && <section key={section.id} aria-labelledby={`building-${section.id}`}>
          <h3 id={`building-${section.id}`}>{section.title}</h3><p>{section.description}</p>{section.id === "contact" && <ContactResources />}
        </section>;
      })}</div>
      <p className="building-content-note">This room is awaiting Riyan’s approved portfolio details.</p>
      <div className="building-actions"><Button onClick={close} disabled={phase === "closing"}>Return to exploration</Button>
        <ButtonLink href={building.portfolioHref} className="button-secondary">Read in Quick Portfolio <span aria-hidden="true">↗</span></ButtonLink></div>
      <p className="building-dismiss-hint">Escape closes this panel. You’ll return to the same spot.</p>
    </>}
  </Modal>;
}
