"use client"

import { create } from "zustand"

/**
 * Minimal global store for cross-cutting application state.
 * Feature-specific state lives in feature stores:
 *   - useNavigationStore (features/navigation/)
 *   - useAudioStore (features/audio/)
 *   - useGenreFilterStore (features/genres/)
 */

interface GlobalState {
  isAppReady: boolean
  setAppReady: (ready: boolean) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isAppReady: true,
  setAppReady: (ready) => set({ isAppReady: ready }),
}))
