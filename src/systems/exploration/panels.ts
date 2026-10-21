import { useGameStore } from "@/stores/game-store";
import { useInteractionStore } from "@/stores/interaction-store";

export function openExplorationPanel(panel: "journal" | "map") {
  const game = useGameStore.getState();
  if (!game.gameStarted || (game.activePanel !== null && game.activePanel !== "journal" && game.activePanel !== "map")) return;
  game.setPanel(panel);
}

export function closeExplorationPanel(now: number) {
  const game = useGameStore.getState();
  if (game.activePanel !== "journal" && game.activePanel !== "map") return;
  useInteractionStore.getState().defer(now);
  game.setPanel(null);
}
