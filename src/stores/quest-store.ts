"use client";

import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { preferenceStorage } from "@/systems/preference-storage";
import { initialExplorationProgress, isQuestId, progressAfterEvent, readExplorationProgress } from "@/systems/exploration/progress";
import type { ExplorationEvent, ExplorationProgress, QuestId } from "@/types/quest";

interface QuestState extends ExplorationProgress {
  recordEvent: (event: ExplorationEvent) => void;
  selectObjective: (id: QuestId | null) => void;
}
export const explorationStorageKey = "riyan-village-exploration-v1";

export function createQuestStore(storage: StateStorage = preferenceStorage) {
  return createStore<QuestState>()(persist((set, get) => ({
    ...initialExplorationProgress(),
    recordEvent: (event) => {
      const current = get(), next = progressAfterEvent(current, event);
      if (next !== current) set(next);
    },
    selectObjective: (id) => {
      if (id !== null && (!isQuestId(id) || get().completedObjectives.includes(id))) return;
      if (get().selectedObjective !== id) set({ selectedObjective: id });
    },
  }), {
    name: explorationStorageKey, version: 1, skipHydration: true,
    storage: createJSONStorage(() => storage),
    partialize: ({ completedObjectives, selectedObjective }) => ({ completedObjectives, selectedObjective }),
    // An incompatible version starts a fresh optional journal; no gameplay state is restored.
    migrate: () => initialExplorationProgress(),
    merge: (saved, current) => ({ ...current, ...readExplorationProgress(saved) }),
  }));
}

export const questStore = createQuestStore();
export function useQuestStore<T>(selector: (state: QuestState) => T): T { return useStore(questStore, selector); }

export async function hydrateQuestProgress(store = questStore) {
  // JSON parsing errors are handled by persist; denied storage is handled by the adapter.
  // Call before starting interactions, so a late saved snapshot cannot erase a discovery.
  if (!store.persist.hasHydrated()) await store.persist.rehydrate();
}
