"use client";

import { useInteractionStore } from "@/stores/interaction-store";

export function LocationNotification() {
  const location = useInteractionStore((state) => state.location);
  return <div className="location-notification" role="status" aria-live="polite" aria-atomic="true">
    <span className="location-caption">You are in</span><strong key={location}>{location}</strong>
  </div>;
}
