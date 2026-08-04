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

  const { activeTab, currentTrack, isPlaying, selectedGenre } = useGenreStore()
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

  // Unified mobile view visibility logic:
  // - When a region is selected (from 3D Map pin or Region directory), show GenreListPanel (showRightOnMobile = true)
  // - When no region is selected, show Left Column (Globe on Map tab, RegionView on Region tab)
  const showLeftOnMobile = !selectedGenre
  const showRightOnMobile = Boolean(selectedGenre)

  return (
    <div className="h-screen bg-white text-black flex flex-col items-center overflow-hidden">
      {/* Full-width wrapper: 32px top & bottom padding, responsive padding on mobile */}
      <div className="w-full max-w-[1280px] px-4 md:px-0 pt-4 md:pt-8 pb-4 md:pb-8 flex flex-col flex-1 overflow-hidden">
        {/* Header: logo + tabs row */}
        <NavigationHeader />

        {/* Main Content: Dual 50/50 column layout on desktop, responsive mobile view */}
        <main className="flex-1 flex flex-col md:flex-row gap-4 md:gap-8 pt-4 overflow-hidden">
          {/* Left Column: Globe (Map Tab) or RegionView (Region Tab) */}
          <div
            className={`flex-1 overflow-y-auto custom-scrollbar ${
              showLeftOnMobile ? "block" : "hidden md:block"
            }`}
          >
            {activeTab === "map" ? (
              <div className="w-full h-full flex items-center justify-start overflow-hidden p-2">
                <Globe className="w-full max-w-[360px] sm:max-w-[480px] aspect-square" />
              </div>
            ) : (
              <RegionView />
            )}
          </div>

          {/* Right Column: GenreListPanel (Always present on desktop!) */}
          <div
            className={`flex-1 overflow-y-auto custom-scrollbar ${
              showRightOnMobile ? "block" : "hidden md:block"
            }`}
          >
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
