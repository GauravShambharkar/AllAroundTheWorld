import { create } from "zustand"
import { fetchMusicBrainzGenres } from "@/lib/musicbrainz"

export interface GenreTrackInfo {
  title: string
  artist: string
  albumArt: string
  previewUrl: string
  spotifyUrl: string
}

export const DEFAULT_GENRES: string[] = []

interface GenreStore {
  activeTab: "map" | "region"
  selectedRegionName: string | null
  selectedGenre: string | null
  selectedContinent: string | null
  activeGenreList: string[]
  playingGenre: string | null
  currentTrack: GenreTrackInfo | null
  isPlaying: boolean
  isLoadingAudio: boolean
  isMusicBrainzLoading: boolean

  regionFilter: string
  setRegionFilter: (filter: string) => void
  setActiveTab: (tab: "map" | "region") => void
  setSelectedRegion: (name: string, genres: string[], continent?: string) => void
  loadMusicBrainzGenres: (query?: string) => Promise<void>
  playGenreTrack: (genreName: string) => Promise<void>
  togglePlayPause: () => void
  stopAudio: () => void
}

export const useGenreStore = create<GenreStore>((set, get) => ({
  activeTab: "map",
  selectedRegionName: null,
  selectedGenre: null,
  selectedContinent: null,
  activeGenreList: [],
  playingGenre: null,
  currentTrack: null,
  isPlaying: false,
  isLoadingAudio: false,
  isMusicBrainzLoading: false,
  regionFilter: "",

  setRegionFilter: (filter) => set({ regionFilter: filter }),

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

  playGenreTrack: async (genreName: string) => {
    const cleanName = genreName.replace(/^\d+\.\s*/, "").trim()

    if (get().playingGenre === cleanName && get().isPlaying) {
      set({ isPlaying: false })
      return
    }

    set({
      playingGenre: cleanName,
      isLoadingAudio: true,
      isPlaying: false,
    })

    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(cleanName)}`)
      const data = await res.json()
      const tracks = data.tracks || []

      const validTrack = tracks.find((t: any) => t.previewUrl)

      if (validTrack) {
        set({
          currentTrack: {
            title: validTrack.title,
            artist: validTrack.artist,
            albumArt: validTrack.albumArt,
            previewUrl: validTrack.previewUrl,
            spotifyUrl: validTrack.spotifyUrl,
          },
          isPlaying: true,
          isLoadingAudio: false,
        })
      } else {
        console.warn(`No audio preview found for ${cleanName}`)
        set({
          isLoadingAudio: false,
          isPlaying: false,
        })
      }
    } catch (err) {
      console.error("Error playing genre track:", err)
      set({
        isLoadingAudio: false,
        isPlaying: false,
      })
    }
  },

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  stopAudio: () => set({ isPlaying: false, playingGenre: null, currentTrack: null }),
}))
