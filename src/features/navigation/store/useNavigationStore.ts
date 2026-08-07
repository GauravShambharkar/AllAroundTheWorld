"use client"

import { create } from "zustand"
import { fetchMusicBrainzGenres } from "@/lib/musicbrainz"

interface NavigationState {
  activeTab: "map" | "region"
  selectedRegionName: string | null
  selectedGenre: string | null
  selectedContinent: string | null
  activeGenreList: string[]
  regionFilter: string
  isMusicBrainzLoading: boolean

  setActiveTab: (tab: "map" | "region") => void
  setSelectedRegion: (name: string, genres: string[], continent?: string) => void
  setRegionFilter: (filter: string) => void
  loadMusicBrainzGenres: (query?: string) => Promise<void>
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: "map",
  selectedRegionName: null,
  selectedGenre: null,
  selectedContinent: null,
  activeGenreList: [],
  regionFilter: "",
  isMusicBrainzLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setRegionFilter: (filter) => set({ regionFilter: filter }),

  setSelectedRegion: (name, genres, continent) =>
    set({
      selectedRegionName: name,
      selectedGenre: name,
      selectedContinent: continent || null,
      activeGenreList: genres,
    }),

  loadMusicBrainzGenres: async (query?: string) => {
    set({ isMusicBrainzLoading: true })
    try {
      const mbGenres = await fetchMusicBrainzGenres(query)
      if (mbGenres.length > 0) {
        const formatted = mbGenres.map((g, i) => `${i + 1}. ${g.name}`)
        set({
          selectedRegionName: query ? `MusicBrainz API: "${query}"` : "MusicBrainz API (All Genres)",
          activeGenreList: formatted,
          isMusicBrainzLoading: false,
        })
      } else {
        set({ isMusicBrainzLoading: false })
      }
    } catch (err) {
      console.error("MusicBrainz store error:", err)
      set({ isMusicBrainzLoading: false })
    }
  },
}))
