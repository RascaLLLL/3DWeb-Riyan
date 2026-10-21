import type { DiscoveryObjectiveId } from "@/types/dialogue";
import { quests } from "./quests";

// Dialogue validation uses the same objective catalog as the journal.
export const discoveryObjectives = Object.fromEntries(quests.map((quest) => [quest.id, quest.title])) as Record<DiscoveryObjectiveId, string>;
