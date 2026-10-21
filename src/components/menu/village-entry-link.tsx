"use client";

import Link, { useLinkStatus } from "next/link";
import { InterfaceIcon } from "@/components/ui/interface-icon";

function EntryLabel() {
  const { pending } = useLinkStatus();
  return <><span><strong>Enter Village</strong><small aria-live="polite">{pending ? "Opening the village…" : "Explore at your own pace"}</small></span><InterfaceIcon name="arrow" className={pending ? "entry-pending" : ""} /></>;
}

export function VillageEntryLink() {
  return <Link href="/world" className="button village-entry"><EntryLabel /></Link>;
}
