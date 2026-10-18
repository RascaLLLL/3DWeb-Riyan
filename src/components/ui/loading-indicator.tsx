export function LoadingIndicator({ label = "Preparing your arrival…" }: { label?: string }) {
  return <div className="loading-indicator" role="status"><span className="loading-seal" aria-hidden="true">✦</span><span>{label}</span></div>;
}
