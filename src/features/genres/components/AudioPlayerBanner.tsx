"use client"

import React, { useState } from "react"
import { useAudioStore } from "@/features/audio/store/useAudioStore"
import {
  Play,
  Pause,
  Volume2,
  Loader2,
  Music,
  ExternalLink,
  Dices,
} from "lucide-react"

export function AudioPlayerBanner() {
  const {
    playingGenre,
    currentTrack,
    isPlaying,
    isLoadingAudio,
    togglePlayPause,
    randomizeGenreTrack,
  } = useAudioStore()

  const [isSpinning, setIsSpinning] = useState(false)

  if (!playingGenre) return null

  const handleDiceClick = async () => {
    setIsSpinning(true)
    await randomizeGenreTrack()
    setTimeout(() => setIsSpinning(false), 500)
  }

  return (
    <div className="w-full bg-[#f9f9f9] border border-black p-3 flex items-center justify-between gap-4 shadow-sm select-none">
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        {currentTrack?.albumArt ? (
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            className="w-10 h-10 rounded object-cover border border-neutral-300 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center shrink-0">
            <Music className="w-5 h-5" />
          </div>
        )}

        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2 text-[12px] font-bold text-black uppercase tracking-tight">
            <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
            <span className="truncate">{playingGenre}</span>
          </div>
          <div className="text-[12px] text-neutral-600 truncate">
            {currentTrack
              ? `${currentTrack.title} — ${currentTrack.artist}`
              : "Loading track..."}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Dice / Random Preview Button */}
        <button
          type="button"
          onClick={handleDiceClick}
          disabled={isLoadingAudio}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono font-medium text-black bg-white border border-neutral-300 rounded hover:bg-neutral-100 hover:border-black active:scale-95 transition-all shadow-sm disabled:opacity-50"
          title="Randomize / Shuffle track preview for this genre"
        >
          <Dices className={`w-4 h-4 text-neutral-700 transition-transform duration-500 ${isSpinning ? "rotate-[360deg]" : ""}`} />
          <span className="hidden sm:inline">Random</span>
        </button>

        {isLoadingAudio ? (
          <Loader2 className="w-5 h-5 animate-spin text-black" />
        ) : (
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-transform active:scale-95"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-1" />
            )}
          </button>
        )}

        {currentTrack?.spotifyUrl && currentTrack.spotifyUrl !== "#" && (
          <a
            href={currentTrack.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-black p-1"
            title="Open on Spotify"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}
