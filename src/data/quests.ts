import type { QuestDefinition, QuestId } from "@/types/quest";

export const quests: readonly QuestDefinition[] = [
  { id: "meet-guide", title: "The First Encounter", description: "Find a friendly face and learn your way around.",
    objectiveType: "talk-to-npc", targetId: "alden", location: "square", instruction: "Speak to Elder Alden near the well.", discovery: "Village introduction and navigation guidance" },
  { id: "guild-records", title: "The Guild’s Records", description: "Browse the records kept by the Adventurer’s Guild.",
    objectiveType: "open-building", targetId: "guild", location: "guild", instruction: "Open the Guild’s project board at its entrance or through Elara.", discovery: "Featured projects and their case studies" },
  { id: "tools-of-trade", title: "Tools of the Trade", description: "Meet the keeper of the village workshop.",
    objectiveType: "talk-to-npc", targetId: "borin", location: "forge", instruction: "Speak to Borin outside the Blacksmith Forge.", discovery: "Skills and technologies" },
  { id: "pages-of-past", title: "Pages of the Past", description: "Let the archivist introduce the records of earlier chapters.",
    objectiveType: "talk-to-npc", targetId: "lyra", location: "library", instruction: "Speak to Lyra outside the Grand Library.", discovery: "Experience, education, and certifications" },
  { id: "message-beyond", title: "A Message Beyond", description: "Visit the gatekeeper to learn how to reach Riyan.",
    objectiveType: "talk-to-npc", targetId: "rowan", location: "gate", instruction: "Speak to Rowan at the Kingdom Gate.", discovery: "Contact information and social profiles" },
];

export const questsById = Object.fromEntries(quests.map((quest) => [quest.id, quest])) as Record<QuestId, QuestDefinition>;
export const explorationCompletionMessage = "Every story in the village has been discovered.";
