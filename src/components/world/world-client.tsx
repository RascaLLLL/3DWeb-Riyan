"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import { useGameStore } from "@/stores/game-store";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { WorldFallback } from "./world-fallback";
import { WorldErrorBoundary } from "./world-error-boundary";

const WorldCanvas = dynamic(() => import("./world-canvas"), { ssr: false, loading: () => <LoadingIndicator label="Opening the village clearing…" /> });
export function WorldClient() {
  const supported = useWebGLSupport();
  const startGame = useGameStore((s) => s.startGame);
  const stopGame = useGameStore((s) => s.stopGame);
  useEffect(() => {
    // Direct world entry must load settings before any action writes persistence.
    if (!useGameStore.persist.hasHydrated()) void useGameStore.persist.rehydrate();
    startGame();
    return stopGame;
  }, [startGame, stopGame]);
  return <WorldErrorBoundary>{supported === null ? <LoadingIndicator label="Preparing the 3D scene…" /> : supported ? <WorldCanvas /> : <WorldFallback />}</WorldErrorBoundary>;
}
