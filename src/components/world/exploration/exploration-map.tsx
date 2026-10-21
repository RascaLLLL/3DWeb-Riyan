"use client";

import { useEffect, useState } from "react";
import { worldConfig } from "@/data/world";
import { questsById } from "@/data/quests";
import { useQuestStore } from "@/stores/quest-store";
import { useGuidanceStore } from "@/stores/guidance-store";
import { useWalkingDestination } from "@/hooks/use-walking-destination";
import { questLocationName } from "@/systems/exploration/map";
import { Button } from "@/components/ui/button";
import { VillageOverviewMap } from "./village-overview-map";
import type { PlayerRuntimeRef } from "@/types/player";
import type { BuildingId, Vec3 } from "@/types/world";

export function ExplorationMap({ runtime, returnToVillage }: { runtime: PlayerRuntimeRef; returnToVillage: () => void }) {
  const selected = useQuestStore((state) => state.selectedObjective);
  const destination = useWalkingDestination();
  const objective = selected ? questsById[selected] : null;
  const [player, setPlayer] = useState<{ position: Vec3; heading: number } | null>(null);
  useEffect(() => {
    // The modal pauses movement. Snapshot after mounting; position is never published per frame.
    const frame = requestAnimationFrame(() => {
      const { position, heading } = runtime.current;
      setPlayer({ position: [position.x, position.y, position.z], heading });
    });
    return () => cancelAnimationFrame(frame);
  }, [runtime]);
  const mark = (id: BuildingId) => {
    useGuidanceStore.getState().highlight(id);
    returnToVillage();
  };
  return <div className="exploration-map">
    <p className="exploration-note">North is up. Follow the roads at your own pace; selecting a destination marks its landmark.</p>
    {player ? <VillageOverviewMap playerPosition={player.position} playerHeading={player.heading} objective={objective} destination={destination} /> : <p role="status">Locating your resident…</p>}
    <div className="map-legend"><span><i className="legend-player" />You</span><span><i className="legend-objective" />Tracked objective</span><span><i className="legend-landmark" />Landmark</span></div>
    {objective && <p className="map-current-objective"><strong>{objective.title}</strong> · {questLocationName(objective)}<br />{objective.instruction}</p>}
    <ol className="map-destinations" aria-label="Walking destinations">{worldConfig.buildings.map((building, index) => <li key={building.id}>
      <span className="map-destination-number" aria-hidden="true">{index + 1}</span><div><strong>{building.name}</strong><span>{building.portfolioSections.join(" · ")}</span></div>
      <Button className="button-small button-secondary" onClick={() => mark(building.id)} aria-label={`Mark ${building.name} and return to the village`}>Mark path</Button>
    </li>)}</ol>
    <p className="journal-footer">Directions and map selection never complete an objective. Speak to a villager or open the Guild’s records to make a discovery.</p>
  </div>;
}
