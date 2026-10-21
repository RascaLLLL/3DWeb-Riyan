import { useId } from "react";
import { worldConfig } from "@/data/world";
import { npcsById } from "@/data/npcs";
import { mapRotation, mapScale, mapSize, questPosition, worldToMap } from "@/systems/exploration/map";
import type { QuestDefinition } from "@/types/quest";
import type { BuildingId, Vec3 } from "@/types/world";

export function VillageOverviewMap({ playerPosition, playerHeading, objective, destination }: {
  playerPosition: Vec3; playerHeading: number; objective: QuestDefinition | null; destination: BuildingId | null;
}) {
  const title = useId(), description = useId();
  const [px, py] = worldToMap(playerPosition[0], playerPosition[2]);
  const [sx, sy] = worldToMap(worldConfig.square.center[0], worldConfig.square.center[2]);
  const guide = worldToMap(npcsById.alden.position[0], npcsById.alden.position[2]);
  const well = worldConfig.props.find((prop) => prop.kind === "well")!;
  const [wx, wy] = worldToMap(well.position[0], well.position[2]);
  const target = objective ? questPosition(objective) : null;
  const targetPoint = target ? worldToMap(target[0], target[2]) : null;
  return <svg className="village-overview-map" viewBox={`0 0 ${mapSize} ${mapSize}`} role="img" aria-labelledby={`${title} ${description}`}>
    <title id={title}>Village overview · north is up</title>
    <desc id={description}>The same roads, building footprints, and positions as the 3D village. You are the blue triangle. {objective ? `Gold diamond: ${objective.title}. ${objective.instruction}` : "No objective is tracked."} Your world position is X {playerPosition[0].toFixed(1)}, Z {playerPosition[2].toFixed(1)}.</desc>
    <circle cx="300" cy="300" r={worldConfig.terrain.radius * mapScale} className="map-terrain" />
    <circle cx={sx} cy={sy} r={worldConfig.square.radius * mapScale} className="map-square" />
    {worldConfig.roads.map((road) => <polyline key={road.id} data-road={road.id} points={road.points.map(([x, z]) => worldToMap(x, z).join(",")).join(" ")} fill="none" stroke={road.surface === "dirt" ? "#b49a72" : "#bab5a2"} strokeWidth={road.width * mapScale} strokeLinejoin="round" strokeLinecap="round" />)}
    {worldConfig.buildings.map((building, index) => {
      const [x, y] = worldToMap(building.position[0], building.position[2]);
      const [w, , d] = building.size;
      const halfHeight = (Math.abs(Math.sin(building.rotation)) * w + Math.abs(Math.cos(building.rotation)) * d) * mapScale / 2;
      // Put northern labels above their roofs, away from entrance/NPC markers.
      const labelY = y + (building.position[2] < 0 ? -halfHeight - 12 : halfHeight + 17);
      return <g key={building.id} data-building={building.id}>
        <rect x={x - w * mapScale / 2} y={y - d * mapScale / 2} width={w * mapScale} height={d * mapScale} rx="2" transform={`rotate(${mapRotation(building.rotation)} ${x} ${y})`} className={destination === building.id ? "map-building is-marked" : "map-building"} />
        <text x={x} y={y + 4} className="map-building-number">{index + 1}</text>
        <text x={x} y={labelY} className="map-building-label">{building.name}</text>
      </g>;
    })}
    <circle cx={wx} cy={wy} r="6" className="map-well" /><text x={sx} y={sy - 29} className="map-place-label">Village Square</text>
    <circle cx={guide[0]} cy={guide[1]} r="3" fill="#52694d" /><text x={guide[0] - 8} y={guide[1] + 15} textAnchor="end" className="map-guide-label">Elder Alden</text>
    {targetPoint && <g transform={`translate(${targetPoint[0]} ${targetPoint[1]})`} data-objective={objective!.id}><path d="M0 -11 8 0 0 11 -8 0Z" className="map-objective" /></g>}
    <g transform={`translate(${px} ${py}) rotate(${playerHeading * -180 / Math.PI})`} data-player="true"><circle r="12" fill="#f4ebd0" fillOpacity=".8" /><path d="M0 12 -8 -8 0 -4 8 -8Z" className="map-player" /></g>
    <g transform="translate(535 72)" className="map-compass"><path d="M0 18V-18M-6-10 0-18 6-10" /><text y="-28">N</text></g>
  </svg>;
}
