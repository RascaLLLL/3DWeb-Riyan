import { lockDocumentScroll } from "./scroll-lock";

/** Native dialog owns focus trapping and Escape; this owns scroll/focus restoration. */
export function mountModal(dialog: HTMLDialogElement, heading: HTMLElement | null, fallbackFocus?: () => void) {
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const releaseScroll = lockDocumentScroll();
  try { dialog.showModal(); } catch (error) { releaseScroll(); throw error; }
  heading?.focus({ preventScroll: true });
  return () => {
    dialog.close(); releaseScroll();
    // Wait for a same-commit dialogue → portfolio handoff before restoring focus.
    queueMicrotask(() => {
      if (document.querySelector("dialog[open]")) return;
      const usableTrigger = previousFocus?.isConnected && previousFocus !== document.body
        && !previousFocus.matches(":disabled")
        && !previousFocus.closest("[hidden], [inert], dialog:not([open]), details:not([open])");
      if (usableTrigger) {
        previousFocus.focus({ preventScroll: true });
        if (document.activeElement === previousFocus) return;
      }
      fallbackFocus?.();
    });
  };
}
