"use client";

import { Modal } from "@/components/ui/modal";
import { Button, ButtonLink } from "@/components/ui/button";
import { useGameStore } from "@/stores/game-store";

export function PauseMenu({ restoreFocus }: { restoreFocus: () => void }) {
  const open = useGameStore((state) => state.userPaused && state.activePanel === null);
  const resume = () => useGameStore.getState().setPaused(false);
  return <Modal open={open} title="A moment of quiet" subtitle="The village is paused" presentation="overlay" className="pause-menu" closeLabel="Resume exploration" onClose={resume} fallbackFocus={restoreFocus}>
    <p>Your place in the village is kept. Continue when you’re ready.</p>
    <div className="pause-actions"><Button onClick={resume}>Resume exploration</Button><Button className="button-secondary" onClick={() => useGameStore.getState().setPanel("settings")}>Settings</Button></div>
    <nav className="pause-routes" aria-label="Other ways to explore"><ButtonLink href="/portfolio" className="button-secondary">Quick Portfolio</ButtonLink><ButtonLink href="/" className="button-secondary">Main menu</ButtonLink></nav>
  </Modal>;
}
