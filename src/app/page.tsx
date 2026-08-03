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

  const selectedGenre = useGenreStore((state) => state.selectedGenre)

  // Clean mobile view logic:
  // - Map tab: Always show Globe (showLeftOnMobile = true)
  // - Region tab with selectedGenre: Show GenreListPanel (showRightOnMobile = true)
  // - Region tab without selectedGenre: Show RegionView (showLeftOnMobile = true)
  const showLeftOnMobile = activeTab === "map" || !selectedGenre
  const showRightOnMobile = activeTab === "region" && Boolean(selectedGenre)

  return (
    <div className="h-screen bg-white text-black flex flex-col items-center overflow-hidden">
      {/* Full-width wrapper: 32px top & bottom padding, responsive padding on mobile */}
      <div className="w-full max-w-[1280px] px-4 md:px-0 pt-4 md:pt-8 pb-4 md:pb-8 flex flex-col flex-1 overflow-hidden">
        {/* Header: logo + tabs row with "List Of Genres" */}
        <NavigationHeader />

        {/* Main Content: 2-column 50/50 split on desktop, responsive 3-step feed on mobile */}
        <main className="flex-1 flex flex-col md:flex-row gap-4 md:gap-8 pt-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="h-full flex flex-col md:flex-row gap-8">
              {/* Left Column: Globe or RegionView */}
              <div className={`flex-1 overflow-y-auto custom-scrollbar ${showLeftOnMobile ? "block" : "hidden md:block"}`}>
                {activeTab === "map" ? (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <Globe className="w-full max-w-[350px] sm:max-w-[480px] aspect-square" />
                  </div>
                ) : (
                  <RegionView />
                )}
              </div>

              {/* Right Column: GenreListPanel */}
              <div className={`flex-1 overflow-y-auto custom-scrollbar ${showRightOnMobile ? "block" : "hidden md:block"}`}>
                <GenreListPanel />
              </div>
            </div>
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
