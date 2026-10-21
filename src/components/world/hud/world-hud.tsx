"use client";

import Link from "next/link";
import { InterfaceIcon } from "@/components/ui/interface-icon";
import { SettingsButton } from "@/components/settings-button";
import { useGameStore } from "@/stores/game-store";
import { useQuestStore } from "@/stores/quest-store";
import { quests, explorationCompletionMessage } from "@/data/quests";
import { openExplorationPanel } from "@/systems/exploration/panels";
import { LocationNotification } from "../interactions/location-notification";
import { DestinationGuidance } from "../interactions/destination-guidance";

export function WorldHUD() {
  const started = useGameStore((state) => state.gameStarted);
  const panel = useGameStore((state) => state.activePanel);
  const blocked = !started || panel !== null;
  const completed = useQuestStore((state) => state.completedObjectives.length);
  return <div className="world-hud-top">
    <div className="world-status hud-surface">
      <LocationNotification />
      <DestinationGuidance />
      <p className="world-discoveries" role="status"><span className="discovery-marks" aria-hidden="true">{quests.map((quest, index) => <span key={quest.id} className={index < completed ? "is-discovered" : ""} />)}</span><span>{completed === quests.length ? explorationCompletionMessage : `${completed} of ${quests.length} discovered`}</span></p>
    </div>
    <nav className="world-actions" aria-label="Village tools">
      <button className="hud-action" disabled={!started} aria-disabled={blocked} aria-label="Open quest journal" title="Journal" onClick={() => openExplorationPanel("journal")}><InterfaceIcon name="journal" /><span>Journal</span></button>
      <button className="hud-action" disabled={!started} aria-disabled={blocked} aria-label="Open village map" title="Map" onClick={() => openExplorationPanel("map")}><InterfaceIcon name="map" /><span>Map</span></button>
      <SettingsButton compact />
      <Link className="hud-action" href="/" aria-label="Exit village to main menu" title="Main menu"><InterfaceIcon name="exit" /><span>Menu</span></Link>
    </nav>
  </div>;
}
