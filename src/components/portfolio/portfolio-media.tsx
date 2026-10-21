"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortfolioImage } from "@/types/portfolio";

export function PortfolioMedia({ media, portrait = false }: { media: PortfolioImage; portrait?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <p className="media-unavailable">Image unavailable. The written portfolio remains available below.</p>;
  return <Image src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy"
    sizes={portrait ? "(max-width: 640px) 150px, 200px" : "(max-width: 640px) 90vw, (max-width: 1000px) 75vw, 900px"}
    className={portrait ? "profile-portrait" : "project-image"} onError={() => setFailed(true)} />;
}
