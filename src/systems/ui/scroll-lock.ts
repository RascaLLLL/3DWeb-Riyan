const owners = new Set<symbol>();
let previous: { style: CSSStyleDeclaration; overflow: string; overscrollBehavior: string }[] = [];

/** Route shells and native overlays share a lock so either can unmount first. */
export function lockDocumentScroll() {
  const owner = Symbol("scroll lock");
  if (!owners.size) {
    previous = [document.documentElement.style, document.body.style].map((style) => ({
      style, overflow: style.overflow, overscrollBehavior: style.overscrollBehavior,
    }));
    for (const { style } of previous) { style.overflow = "hidden"; style.overscrollBehavior = "none"; }
  }
  owners.add(owner);
  return () => {
    if (!owners.delete(owner) || owners.size) return;
    for (const { style, overflow, overscrollBehavior } of previous) {
      style.overflow = overflow; style.overscrollBehavior = overscrollBehavior;
    }
    previous = [];
  };
}
