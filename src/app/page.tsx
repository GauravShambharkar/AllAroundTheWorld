"use client"

import React, { useEffect, useRef, Suspense } from "react"
import { NavigationHeader } from "@/components/NavigationHeader"
import { Globe } from "@/components/ui/cobe-globe"
import { RegionView } from "@/components/RegionView"
import { GenreListPanel } from "@/components/GenreListPanel"
import { useGenreStore } from "@/store/useGenreStore"
import { useNuqsUrlSync } from "@/hooks/useNuqsUrlSync"

function MainExplorer() {
  useNuqsUrlSync()

  const activeTab = useGenreStore((state) => state.activeTab)
  const currentTrack = useGenreStore((state) => state.currentTrack)
  const isPlaying = useGenreStore((state) => state.isPlaying)
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

  return (
    <div className="h-screen bg-white text-black flex flex-col items-center overflow-hidden">
      {/* Full-width wrapper: 32px margin on all sides */}
      <div className="w-full max-w-[1280px] px-8 pt-8 flex flex-col flex-1 overflow-hidden">
        {/* Header: logo + tabs row with "List Of Genres" */}
        <NavigationHeader />

        {/* Main Content: 2-column 50/50 split, 32px gutter */}
        <main className="flex-1 flex flex-col md:flex-row gap-8 pt-4 overflow-hidden">
          {/* Left Column — scrolls independently */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === "map" ? (
              <div className="w-full h-full flex items-center justify-center">
                <Globe className="w-[480px] h-[480px]" />
              </div>
            ) : (
              <RegionView />
            )}
          </div>

          {/* Right Column — scrolls independently */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <GenreListPanel />
          </div>
        </main>
      </div>

      {/* Hidden Global Audio Element for Instant Song Previews */}
      {currentTrack?.previewUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.previewUrl}
          onEnded={() => useGenreStore.getState().stopAudio()}
        />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <MainExplorer />
    </Suspense>
  )
}
