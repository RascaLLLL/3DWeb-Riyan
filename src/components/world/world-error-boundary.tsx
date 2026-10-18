"use client";
import { Component, type ReactNode } from "react";
import { WorldFallback } from "./world-fallback";
export class WorldErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <WorldFallback /> : this.props.children; }
}
