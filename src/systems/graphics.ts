import type { GraphicsQuality } from "@/types/game";
export const graphicsPresets: Record<GraphicsQuality, { dpr: number; shadows: boolean; shadowMapSize: number }> = {
  low: { dpr: 1, shadows: false, shadowMapSize: 512 },
  medium: { dpr: 1.5, shadows: true, shadowMapSize: 1024 },
  high: { dpr: 2, shadows: true, shadowMapSize: 2048 },
};
