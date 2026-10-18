import type { DialogueAction, DialogueCatalog, DialogueEffect, DialogueInput, DialogueResult, DialogueSession } from "@/types/dialogue";
import type { DialogueTreeId, NpcId } from "@/types/npc";

const failed = (message: string): DialogueResult => ({ session: null, effects: [], error: message });

/** Only automatic branches are followed here; cycles fail closed instead of trapping a visitor. */
function enter(catalog: DialogueCatalog, session: DialogueSession, effects: DialogueEffect[] = [], firstAction?: DialogueAction): DialogueResult {
  const visited = new Set<string>();
  let current = session, pending = firstAction, applyNode = !firstAction;
  for (let step = 0; step < 32; step++) {
    const tree = catalog[current.treeId], node = tree?.nodes[current.nodeId];
    if (!node || tree.npcId !== current.npcId || node.speaker !== current.npcId) return failed("This conversation branch is unavailable.");
    const action = pending ?? (applyNode ? node.action : undefined);
    pending = undefined;
    if (!action) return { session: current, effects };
    if (action.type === "close") return { session: null, effects };
    if (action.type === "open-panel") return { session: null, effects: [...effects, action] };
    if (action.type === "branch") {
      const destination = catalog[action.treeId];
      if (!destination) return failed("This conversation branch is unavailable.");
      const nodeId = action.nodeId ?? destination.entry, key = `${action.treeId}:${nodeId}`;
      if (visited.has(key)) return failed("This conversation contains a repeated automatic branch.");
      visited.add(key);
      current = { ...current, treeId: action.treeId, nodeId };
      applyNode = true;
      continue;
    }
    effects.push(action);
    return { session: current, effects };
  }
  return failed("This conversation exceeded its automatic branch limit.");
}

export function startDialogue(catalog: DialogueCatalog, npcId: NpcId, treeId: DialogueTreeId): DialogueResult {
  const tree = catalog[treeId];
  return tree ? enter(catalog, { npcId, treeId, nodeId: tree.entry, turn: 0 }) : failed("This conversation is unavailable.");
}

export function advanceDialogue(catalog: DialogueCatalog, session: DialogueSession, input: DialogueInput): DialogueResult {
  const node = catalog[session.treeId]?.nodes[session.nodeId];
  if (!node) return failed("This conversation node is unavailable.");
  const choice = input.type === "choice" ? node.choices?.find((entry) => entry.id === input.id) : undefined;
  if (input.type === "choice" && !choice || input.type === "continue" && node.choices?.length) return { session, effects: [] };
  const next = choice?.next ?? (input.type === "continue" ? node.next : undefined);
  const action = choice?.action;
  const updated = { ...session, turn: session.turn + 1 };
  if (action?.type === "branch" || action?.type === "close" || action?.type === "open-panel") return enter(catalog, updated, [], action);
  const effects: DialogueEffect[] = action ? [action] : [];
  return next ? enter(catalog, { ...updated, nodeId: next }, effects) : { session: null, effects };
}
