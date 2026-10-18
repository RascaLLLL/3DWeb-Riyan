"use client";
import { useEffect, useState } from "react";
export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      try {
        const gl = canvas.getContext("webgl2");
        setSupported(Boolean(gl));
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch { setSupported(false); }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return supported;
}
