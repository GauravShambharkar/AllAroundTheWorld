"use client"

import { create } from "zustand"
import { ALL_MICROGENRES } from "@/data/all-microgenres"

export interface GenreTrackInfo {
  title: string
  artist: string
  albumArt: string
  previewUrl: string
  spotifyUrl: string
}

interface AudioState {
  playingGenre: string | null
  currentTrack: GenreTrackInfo | null
  isPlaying: boolean
  isLoadingAudio: boolean

  playGenreTrack: (genreName?: string, randomize?: boolean) => Promise<void>
  randomizeGenreTrack: () => Promise<void>
  togglePlayPause: () => void
  stopAudio: () => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  playingGenre: null,
  currentTrack: null,
  isPlaying: false,
  isLoadingAudio: false,

  playGenreTrack: async (genreName?: string, randomize: boolean = false) => {
    const targetGenre = genreName || get().playingGenre
    if (!targetGenre) return

    const cleanName = targetGenre.replace(/^\d+(\.\d+)?\.\s*/, "").trim()

    if (genreName && get().playingGenre === cleanName && get().isPlaying && !randomize) {
      set({ isPlaying: false })
      return
    }

    set({
      playingGenre: cleanName,
      isLoadingAudio: true,
      isPlaying: false,
    })

    const searchQuery = cleanName

    try {
      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(searchQuery)}&random=${randomize ? "true" : "false"}`
      )
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

  randomizeGenreTrack: async () => {
    const current = get().playingGenre
    if (current) {
      await get().playGenreTrack(current, true)
    }
  },

  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  stopAudio: () => set({ isPlaying: false, playingGenre: null, currentTrack: null }),
}))
