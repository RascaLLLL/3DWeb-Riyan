"use client";

import { create } from "zustand";
import { dialogues } from "@/data/dialogues";
import { npcsById } from "@/data/npcs";
import { startDialogue, advanceDialogue } from "@/systems/dialogue/engine";
import { useGameStore } from "./game-store";
import { useInteractionStore } from "./interaction-store";
import { useGuidanceStore } from "./guidance-store";
import type { NpcId } from "@/types/npc";
import type { DialogueInput, DialogueResult, DialogueSession } from "@/types/dialogue";

interface DialogueState {
  session: DialogueSession | null;
  phase: "closed" | "open" | "closing";
  error: string | null;
  start: (id: NpcId, now: number) => void;
  respond: (input: DialogueInput) => void;
  beginClose: () => void;
  finishClose: (now: number) => void;
  reset: () => void;
}
const initial = { session: null, phase: "closed" as DialogueState["phase"], error: null };

export const useDialogueStore = create<DialogueState>((set, get) => {
  const apply = (result: DialogueResult) => {
    const panel = result.effects.find((effect) => effect.type === "open-panel");
    for (const effect of result.effects) {
      if (effect.type === "highlight-destination") useGuidanceStore.getState().highlight(effect.destination);
      if (effect.type === "complete-objective") useGuidanceStore.getState().complete(effect.objective);
    }
    if (panel?.type === "open-panel") {
      // Direct handoff keeps physics blocked; neither an unpause nor a teleport is involved.
      if (useInteractionStore.getState().openFromDialogue(panel.destination)) set({ session: null, phase: "closed", error: null });
      else set({ phase: "closing", error: "That portfolio panel is unavailable. You can return to exploration." });
    } else if (!result.session) {
      // Keep the last node on screen for the closing fade, including engine failures.
      set({ phase: "closing", error: result.error ?? null });
    } else set({ session: result.session, phase: "open", error: null });
  };
  return {
    ...initial,
    start: (id, now) => {
      const game = useGameStore.getState(), interaction = useInteractionStore.getState();
      if (!game.gameStarted || game.gamePaused || game.activePanel !== null || get().phase !== "closed"
        || interaction.nearbyNpcId !== id || now < interaction.cooldownUntil) return;
      const npc = npcsById[id];
      if (!npc) return;
      const result = startDialogue(dialogues, id, npc.dialogueTreeId);
      if (result.error) { set({ error: result.error }); return; }
      game.setPanel("dialogue");
      interaction.publish(null, interaction.location, null);
      apply(result);
    },
    respond: (input) => {
      const { session, phase } = get();
      if (session && phase === "open" && useGameStore.getState().activePanel === "dialogue") apply(advanceDialogue(dialogues, session, input));
    },
    beginClose: () => { if (get().phase === "open") set({ phase: "closing" }); },
    finishClose: (now) => {
      if (get().phase !== "closing") return;
      set({ session: null, phase: "closed" });
      useInteractionStore.getState().defer(now);
      if (useGameStore.getState().activePanel === "dialogue") useGameStore.getState().setPanel(null);
    },
    reset: () => {
      set(initial);
      if (useGameStore.getState().activePanel === "dialogue") useGameStore.getState().setPanel(null);
    },
  };
});
