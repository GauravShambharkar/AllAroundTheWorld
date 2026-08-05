import { StateCreator } from "zustand"
import { ALL_MICROGENRES } from "@/data/all-microgenres"

export interface GenreTrackInfo {
  title: string
  artist: string
  albumArt: string
  previewUrl: string
  spotifyUrl: string
}

export interface AudioSlice {
  playingGenre: string | null
  currentTrack: GenreTrackInfo | null
  isPlaying: boolean
  isLoadingAudio: boolean

  playGenreTrack: (genreName: string) => Promise<void>
  togglePlayPause: () => void
  stopAudio: () => void
}

export const createAudioSlice: StateCreator<AudioSlice> = (set, get) => ({
  playingGenre: null,
  currentTrack: null,
  isPlaying: false,
  isLoadingAudio: false,

  playGenreTrack: async (genreName: string) => {
    const cleanName = genreName.replace(/^\d+(\.\d+)?\.\s*/, "").trim()

    if (get().playingGenre === cleanName && get().isPlaying) {
      set({ isPlaying: false })
      return
    }

    set({
      playingGenre: cleanName,
      isLoadingAudio: true,
      isPlaying: false,
    })

    const matched = ALL_MICROGENRES.find(
      (g) => g.name.toLowerCase() === cleanName.toLowerCase() || g.id.toLowerCase() === cleanName.toLowerCase()
    )
    const searchQuery = matched ? matched.query : cleanName

    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}`)
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
})
