import type { StateStorage } from "zustand/middleware";

// Storage denial or quota exhaustion must not break navigation or settings.
// Preferences continue to work in memory when persistence is unavailable.
export const preferenceStorage: StateStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch { /* Keep in-memory settings. */ }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name); } catch { /* Storage is optional. */ }
  },
};
