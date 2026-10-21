"use client";

import { Modal } from "@/components/ui/modal";
import { useGameStore } from "@/stores/game-store";
import { questStore, useQuestStore } from "@/stores/quest-store";
import { useGuidanceStore } from "@/stores/guidance-store";
import { quests, explorationCompletionMessage } from "@/data/quests";
import { closeExplorationPanel, openExplorationPanel } from "@/systems/exploration/panels";
import { QuestJournal } from "./quest-journal";
import { ExplorationMap } from "./exploration-map";
import type { PlayerRuntimeRef } from "@/types/player";

export function ExplorationToolbar() {
  const panel = useGameStore((state) => state.activePanel);
  const started = useGameStore((state) => state.gameStarted);
  const completed = useQuestStore((state) => state.completedObjectives.length);
  const blocked = !started || (panel !== null && panel !== "journal" && panel !== "map");
  return <div className="exploration-toolbar" aria-label="Exploration tools">
    <div><button className="player-tool" disabled={blocked} onClick={() => openExplorationPanel("journal")}>Journal</button>
      <button className="player-tool" disabled={blocked} onClick={() => openExplorationPanel("map")}>Map</button></div>
    <p role="status">{completed === quests.length ? explorationCompletionMessage : `Optional discoveries · ${completed} / ${quests.length}`}</p>
  </div>;
}

export function ExplorationInterface({ runtime, restoreFocus }: { runtime: PlayerRuntimeRef; restoreFocus: () => void }) {
  const panel = useGameStore((state) => state.activePanel);
  const completedObjectives = useQuestStore((state) => state.completedObjectives);
  const selectedObjective = useQuestStore((state) => state.selectedObjective);
  const open = panel === "journal" || panel === "map";
  const close = () => closeExplorationPanel(performance.now());
  return <Modal open={open} title="The traveller’s journal" onClose={close} onAfterClose={restoreFocus} closeLabel="Return to village" className="building-modal exploration-modal">
    {open && <>
      <nav aria-label="Journal pages" className="journal-navigation"><button aria-pressed={panel === "journal"} onClick={() => openExplorationPanel("journal")}>Discoveries</button><button aria-pressed={panel === "map"} onClick={() => openExplorationPanel("map")}>Village map</button></nav>
      {panel === "journal" ? <QuestJournal progress={{ completedObjectives, selectedObjective }} select={(id) => {
        questStore.getState().selectObjective(id);
        useGuidanceStore.getState().highlight(null);
      }} showMap={() => openExplorationPanel("map")} /> : <ExplorationMap runtime={runtime} returnToVillage={close} />}
    </>}
  </Modal>;
}
