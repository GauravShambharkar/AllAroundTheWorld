import { StateCreator } from "zustand"
import { fetchMusicBrainzGenres } from "@/lib/musicbrainz"

export interface NavigationSlice {
  activeTab: "map" | "region"
  selectedRegionName: string | null
  selectedGenre: string | null
  selectedContinent: string | null
  activeGenreList: string[]
  regionFilter: string
  genreFilter: string
  isMusicBrainzLoading: boolean

  setRegionFilter: (filter: string) => void
  setGenreFilter: (filter: string) => void
  setActiveTab: (tab: "map" | "region") => void
  setSelectedRegion: (name: string, genres: string[], continent?: string) => void
  loadMusicBrainzGenres: (query?: string) => Promise<void>
}

export const createNavigationSlice: StateCreator<NavigationSlice> = (set) => ({
  activeTab: "map",
  selectedRegionName: null,
  selectedGenre: null,
  selectedContinent: null,
  activeGenreList: [],
  regionFilter: "",
  genreFilter: "",
  isMusicBrainzLoading: false,

  setRegionFilter: (filter) => set({ regionFilter: filter }),
  setGenreFilter: (filter) => set({ genreFilter: filter }),

  setActiveTab: (tab) => set({ activeTab: tab }),

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
})
