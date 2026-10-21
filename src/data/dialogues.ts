import { directions } from "./directions";
import { portfolio } from "./portfolio";
import { projectCategories } from "./portfolio/projects";
import type { DialogueCatalog, DialogueNode, DialogueTree } from "@/types/dialogue";
import type { DialogueTreeId, NpcId } from "@/types/npc";
import type { BuildingId } from "@/types/world";

type NodeContent = Omit<DialogueNode, "id" | "speaker">;
function tree(id: DialogueTreeId, npcId: NpcId, nodes: Record<string, NodeContent>): DialogueTree {
  return { id, npcId, entry: "welcome", nodes: Object.fromEntries(Object.entries(nodes).map(([nodeId, node]) => [nodeId, { ...node, id: nodeId, speaker: npcId }])) };
}
const leave = { id: "leave", label: "Thank you. I’ll keep exploring.", action: { type: "close" as const } };
const open = (destination: BuildingId, label: string) => ({ id: "open", label, action: { type: "open-panel" as const, destination } });
const back = { id: "back", label: "I have another question.", next: "welcome" };
const way = (destination: BuildingId, label: string) => ({ id: destination, label, next: `way-${destination}`, action: { type: "highlight-destination" as const, destination } });
const publishedCategories = Array.from(new Set(portfolio.projects.map((project) => projectCategories[project.category]))).join(", ");

export const dialogues: DialogueCatalog = {
  "village-guide": tree("village-guide", "alden", {
    welcome: { text: "Welcome to Riyan’s village. Take your time—the paths lead to the portfolio, and I can help you find your way.", expression: "warm",
      action: { type: "complete-objective", objective: "meet-guide" }, choices: [
        { id: "controls", label: "How do I explore?", action: { type: "branch", treeId: "village-guide", nodeId: "controls" } },
        { id: "directions", label: "Where should I go?", next: "destinations" },
        open("cottage", "Tell me about Riyan."),
        { id: "objectives", label: "Suggest an optional stroll.", next: "objectives" }, leave,
      ] },
    controls: { text: "Focus the village to begin. WASD or the arrow keys walk; Shift runs. Near a person or entrance, press E. The closest reachable target gets the prompt.", next: "camera" },
    camera: { text: "Drag to look around and scroll to adjust distance. Escape closes a conversation or pauses exploration. Small screens have movement buttons. Quick Portfolio gives you the direct HTML route.", choices: [back, leave] },
    destinations: { text: "Every landmark has a purpose. Choose a destination and I’ll mark it for you. You’ll still walk there at your own pace.", choices: [
      way("cottage", "The Cottage — About Me"), way("guild", "Adventurer’s Guild — Projects"), way("forge", "Blacksmith Forge — Skills"),
      way("library", "Grand Library — Archives"), way("gate", "Kingdom Gate — Contact"), back, leave,
    ] },
    ...Object.fromEntries((Object.keys(directions) as BuildingId[]).map((id) => [`way-${id}`, { text: directions[id], expression: "thoughtful", next: "destinations" } satisfies NodeContent])),
    objectives: { text: "Your journal notes five optional discoveries. Browse the guild’s project board, meet Borin and Lyra, then visit Rowan. Open Journal or Map above the village to choose a destination. You can visit in any order; every portfolio record is always available.", choices: [back, leave] },
  }),
  "guild-keeper": tree("guild-keeper", "elara", {
    welcome: { text: `Elara, guild keeper. There are ${portfolio.projects.length} real project records on the board. Choose a notice to see the approach, contribution, and published results—with missing details clearly marked.`, expression: "cheerful",
      choices: [open("guild", "Open featured projects."), { id: "categories", label: "How are the projects arranged?", next: "categories" }, { id: "board", label: "Where is the quest board?", next: "board", action: { type: "highlight-destination", destination: "guild" } }, leave] },
    categories: { text: `The records cover ${publishedCategories}. Each opens a case study. A project’s demo or repository appears only when its destination is verified.`, choices: [open("guild", "Show me the project showcase."), back, leave] },
    board: { text: "The project quest board opens through the guild entrance or from me. Choose a notice to read its case study, then return to the board without leaving your place in the village.", choices: [open("guild", "Open the project showcase."), back, leave] },
  }),
  "forge-master": tree("forge-master", "borin", {
    welcome: { text: "Borin. I look after the tools of the trade. The skills records belong here—rather easier to carry than an anvil.", expression: "warm",
      choices: [open("forge", "Open skills and technologies."), { id: "categories", label: "What do the skill categories mean?", next: "categories" }, leave] },
    categories: { text: "Languages are the core materials; frameworks help shape the interface; tools are workshop equipment. The records include Python, React, Next.js, and more. Skills being explored are labeled separately—there are no proficiency percentages.", choices: [open("forge", "Show me the skills interface."), back, leave] },
  }),
  archivist: tree("archivist", "lyra", {
    welcome: { text: "I’m Lyra, the archivist. These shelves keep work history, education, and certifications together. Which part would you like to understand?", expression: "calm",
      choices: [{ id: "work", label: "Tell me about work experience.", next: "work" }, { id: "education", label: "What belongs in the education records?", next: "education" }, { id: "certifications", label: "Are certifications available?", next: "certifications" }, open("library", "Open the archives."), leave] },
    work: { text: "The archives list freelance web development, Roblox game development, and maintenance work at Astra Visteon Indonesia. You can read the published dates and responsibilities. Exact months and documented outcomes still need completion.", choices: [open("library", "Open the experience archive."), back, leave] },
    education: { text: `Riyan’s published education is ${portfolio.education[0].studyProgram} at ${portfolio.education[0].institution}. The record includes academic focus areas; it does not invent a graduation date, GPA, or honors.`, choices: [open("library", "Open the education archive."), back, leave] },
    certifications: { text: `There are ${portfolio.certifications.length} published certification records, with their original titles and issuers. Issue dates and credential verification links are still TODO, so no verification buttons are shown yet.`, choices: [open("library", "Open the certification archive."), back, leave] },
  }),
  gatekeeper: tree("gatekeeper", "rowan", {
    welcome: { text: "Welcome. I’m Rowan, keeper of the gate. This is the place for contact details, approved social profiles, and a CV when Riyan makes one available.", expression: "warm",
      choices: [open("gate", "Open contact and social links."), { id: "contact", label: "How can I contact Riyan?", next: "contact" }, { id: "cv", label: "Is a CV available?", next: "cv" }, leave] },
    contact: { text: portfolio.contact.email || portfolio.contact.socialProfiles.length ? "The contact panel holds Riyan’s approved contact channels and social profiles. Choose the channel that suits your message; the links open from that panel." : "No verified contact channels or social profiles have been provided yet. The contact panel will display the approved links when they’re added; I won’t send you to an unverified address.", choices: [open("gate", "Show me the contact panel."), back, leave] },
    cv: { text: portfolio.contact.cv ? "Riyan’s approved CV is available from the contact panel. Its download link points to the actual document." : "An approved CV file has not been provided, so there is no download yet. You can check the contact panel; it will offer a download only when the actual document is available.", choices: [open("gate", "Check the contact panel."), back, leave] },
  }),
};
