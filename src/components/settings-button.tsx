"use client";
import { useGameStore } from "@/stores/game-store";
import { Button } from "./ui/button";
import { InterfaceIcon } from "./ui/interface-icon";
export function SettingsButton({ compact = false }: { compact?: boolean }) {
  const setPanel = useGameStore((s) => s.setPanel);
  const panel = useGameStore((s) => s.activePanel);
  return <Button className={compact ? "hud-action hud-settings" : "button-secondary"} aria-disabled={panel !== null} aria-label="Open settings" title="Settings"
    onClick={() => { if (useGameStore.getState().activePanel === null) setPanel("settings"); }}><InterfaceIcon name="settings" /><span>Settings</span></Button>;
}
