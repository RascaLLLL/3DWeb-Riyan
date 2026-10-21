"use client";

import { useInteractionStore } from "@/stores/interaction-store";

export function LocationNotification() {
  const location = useInteractionStore((state) => state.location);
  return <div className="location-notification" role="status" aria-live="polite" aria-atomic="true">
    <span className="location-caption">Location</span><strong key={location}>{location}</strong>
  </div>;
}
