"use client"

import { useEffect, useRef } from "react"
import { useAudioStore } from "@/features/audio/store/useAudioStore"

export function useAudioSync() {
  const { currentTrack, isPlaying, stopAudio } = useAudioStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sync HTML5 audio element with Zustand store playback state
  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying && currentTrack?.previewUrl) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay audio blocked or error:", err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrack])

  return {
    audioRef,
    currentTrack,
    handleEnded: stopAudio,
  }
}
