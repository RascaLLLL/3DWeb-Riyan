import { directions } from "./directions";
import { portfolio } from "./portfolio";
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
    objectives: { text: "For a short stroll, meet Elara at the guild, Borin at the forge, and Lyra at the library. Finish with Rowan at the gate. Meeting your guide is already noted; the rest is simply an invitation.", choices: [back, leave] },
  }),
  "guild-keeper": tree("guild-keeper", "elara", {
    welcome: { text: "Elara, guild keeper. I help visitors find their way through the project records. Riyan’s approved project entries aren’t published yet, but I can show you where they belong.", expression: "cheerful",
      choices: [open("guild", "Open featured projects."), { id: "categories", label: "How are the projects arranged?", next: "categories" }, { id: "board", label: "Where is the quest board?", next: "board", action: { type: "highlight-destination", destination: "guild" } }, leave] },
    categories: { text: "Each project record should explain the problem, approach, technologies, and verified result. Categories will follow Riyan’s real entries; no project categories or achievements have been supplied yet.", choices: [open("guild", "Show me the project showcase."), back, leave] },
    board: { text: "Look for the hanging board beside the guild entrance. In this version, the Projects panel holds the records; the wooden board itself has no separate interaction yet.", choices: [open("guild", "Open the project showcase."), back, leave] },
  }),
  "forge-master": tree("forge-master", "borin", {
    welcome: { text: "Borin. I look after the tools of the trade. The skills records belong here—rather easier to carry than an anvil.", expression: "warm",
      choices: [open("forge", "Open skills and technologies."), { id: "categories", label: "What do the skill categories mean?", next: "categories" }, leave] },
    categories: { text: "Languages describe how code is written; frameworks shape an application; tools help build and test it. Those are useful groups to browse, not claims about Riyan’s skills. The approved skill list is still awaiting content.", choices: [open("forge", "Show me the skills interface."), back, leave] },
  }),
  archivist: tree("archivist", "lyra", {
    welcome: { text: "I’m Lyra, the archivist. These shelves keep work history, education, and certifications together. Which part would you like to understand?", expression: "calm",
      choices: [{ id: "work", label: "Tell me about work experience.", next: "work" }, { id: "education", label: "What belongs in the education records?", next: "education" }, { id: "certifications", label: "Are certifications available?", next: "certifications" }, open("library", "Open the archives."), leave] },
    work: { text: "The experience records are for verified roles, responsibilities, and dates. No professional history has been provided yet; an empty shelf is better than an invented record.", choices: [open("library", "Open the experience archive."), back, leave] },
    education: { text: "Education records will identify the institution, course, and dates once Riyan approves them. There are no education details published yet.", choices: [open("library", "Open the education archive."), back, leave] },
    certifications: { text: "No verified certifications have been supplied. When they are, the archives can list the issuer, credential, and any approved verification link.", choices: [open("library", "Open the certification archive."), back, leave] },
  }),
  gatekeeper: tree("gatekeeper", "rowan", {
    welcome: { text: "Welcome. I’m Rowan, keeper of the gate. This is the place for contact details, approved social profiles, and a CV when Riyan makes one available.", expression: "warm",
      choices: [open("gate", "Open contact and social links."), { id: "contact", label: "How can I contact Riyan?", next: "contact" }, { id: "cv", label: "Is a CV available?", next: "cv" }, leave] },
    contact: { text: portfolio.contact.email || portfolio.contact.socialProfiles.length ? "The contact panel holds Riyan’s approved contact channels and social profiles. Choose the channel that suits your message; the links open from that panel." : "No verified contact channels or social profiles have been provided yet. The contact panel will display the approved links when they’re added; I won’t send you to an unverified address.", choices: [open("gate", "Show me the contact panel."), back, leave] },
    cv: { text: portfolio.contact.cv ? "Riyan’s approved CV is available from the contact panel. Its download link points to the actual document." : "An approved CV file has not been provided, so there is no download yet. You can check the contact panel; it will offer a download only when the actual document is available.", choices: [open("gate", "Check the contact panel."), back, leave] },
  }),
};
