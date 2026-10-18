import type { ReactNode } from "react";
export function MedievalInterface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`medieval-interface ${className}`}>{children}</div>;
}
