"use client";
import { useGameStore } from "@/stores/game-store";
import { Button } from "./ui/button";
export function SettingsButton() {
  const setPanel = useGameStore((s) => s.setPanel);
  return <Button className="button-secondary" onClick={() => setPanel("settings")}>Settings <span aria-hidden="true">↗</span></Button>;
}
