type IconName = "journal" | "map" | "settings" | "arrow" | "check" | "close" | "exit" | "controls";
const paths: Record<IconName, string> = {
  journal: "M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v14m-2 2a2 2 0 0 1 2-2h14M9 7h6m-6 4h5",
  map: "m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16",
  settings: "M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6M10 15v6",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  exit: "M9 21H4V3h12v5M12 14h9m-4-4 4 4-4 4M9 21V7l7-4",
  controls: "M3 6h18v13H3ZM6 10h1m3 0h1m3 0h1m3 0h0M6 14h1m3 0h7",
};
export function InterfaceIcon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={`interface-icon ${className}`}><path d={paths[name]} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
