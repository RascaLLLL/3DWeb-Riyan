"use client";

import { buildingPresentations } from "@/data/building-interactions";
import { useGuidanceStore } from "@/stores/guidance-store";

export function DestinationGuidance() {
  const destination = useGuidanceStore((state) => state.destination);
  if (!destination) return null;
  return <aside className="destination-guidance" aria-label="Walking destination">
    <span className="location-caption">Path marked</span><strong>{buildingPresentations[destination].title}</strong>
    <p>Follow the gold landmark.</p><button onClick={() => useGuidanceStore.getState().highlight(null)}>Clear directions</button>
  </aside>;
}
