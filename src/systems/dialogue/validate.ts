import type { DialogueAction, DialogueCatalog, DialogueNode } from "@/types/dialogue";

/** Authoring checks, exercised by the dialogue suite before content is shipped. */
export function validateDialogueCatalog(catalog: DialogueCatalog, destinations: readonly string[], objectives: readonly string[]) {
  const errors: string[] = [];
  const edgeKey = (treeId: string, nodeId: string) => `${treeId}:${nodeId}`;
  const graph = new Map<string, string[]>(), exits = new Set<string>();
  for (const [treeId, tree] of Object.entries(catalog)) {
    if (tree.id !== treeId || !tree.nodes[tree.entry]) errors.push(`${treeId}: invalid entry or tree ID`);
    for (const [nodeId, node] of Object.entries(tree.nodes)) {
      const key = edgeKey(treeId, nodeId), edges: string[] = [];
      graph.set(key, edges);
      if (node.id !== nodeId || node.speaker !== tree.npcId || !node.text.trim()) errors.push(`${key}: invalid identity, speaker, or text`);
      const link = (next: string) => {
        if (!tree.nodes[next]) errors.push(`${key}: missing node ${next}`);
        edges.push(edgeKey(treeId, next));
      };
      const action = (value?: DialogueAction) => {
        if (!value) return;
        if (value.type === "close" || value.type === "open-panel") exits.add(key);
        if ((value.type === "open-panel" || value.type === "highlight-destination") && !destinations.includes(value.destination)) errors.push(`${key}: invalid destination`);
        if (value.type === "complete-objective" && !objectives.includes(value.objective)) errors.push(`${key}: invalid objective`);
        if (value.type === "branch") {
          const target = catalog[value.treeId], next = value.nodeId ?? target?.entry;
          if (!target?.nodes[next] || target.npcId !== tree.npcId) errors.push(`${key}: invalid branch`);
          if (next) edges.push(edgeKey(value.treeId, next));
        }
      };
      if (node.next) link(node.next);
      action(node.action);
      const ids = new Set<string>();
      for (const choice of node.choices ?? []) {
        if (!choice.id || ids.has(choice.id) || !choice.label.trim()) errors.push(`${key}: invalid/duplicate choice`);
        ids.add(choice.id);
        if (choice.next) link(choice.next);
        action(choice.action);
        if (!choice.next && !choice.action) exits.add(key);
      }
      if (!node.choices?.length && !node.next) exits.add(key);
      // Follow only automatic node branches. Manual "another question" loops are safe.
      const seen = new Set<DialogueNode>();
      let current: DialogueNode | undefined = node;
      while (current?.action?.type === "branch") {
        if (seen.has(current)) { errors.push(`${key}: automatic branch cycle`); break; }
        seen.add(current);
        const branch: Extract<DialogueAction, { type: "branch" }> = current.action;
        const target = catalog[branch.treeId];
        current = target?.nodes[branch.nodeId ?? target.entry];
      }
    }
  }
  for (const key of graph.keys()) {
    const pending = [key], seen = new Set<string>();
    let escape = false;
    while (pending.length) {
      const next = pending.pop()!;
      if (seen.has(next)) continue;
      seen.add(next);
      if (exits.has(next)) { escape = true; break; }
      pending.push(...(graph.get(next) ?? []));
    }
    if (!escape) errors.push(`${key}: no dialogue exit path`);
  }
  return errors;
}
