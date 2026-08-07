"use client"

import { create } from "zustand"

interface GenreFilterState {
  genreFilter: string
  setGenreFilter: (filter: string) => void
}

export const useGenreFilterStore = create<GenreFilterState>((set) => ({
  genreFilter: "",
  setGenreFilter: (filter) => set({ genreFilter: filter }),
}))
