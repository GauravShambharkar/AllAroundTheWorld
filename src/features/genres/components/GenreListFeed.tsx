"use client"

import React from "react"
import { useAudioStore } from "@/features/audio/store/useAudioStore"

interface GenreListFeedProps {
  visibleGenres: string[]
  genreListLength: number
  hasMore: boolean
  onLoadMore: () => void
}

export function GenreListFeed({
  visibleGenres,
  genreListLength,
  hasMore,
  onLoadMore,
}: GenreListFeedProps) {
  const { playingGenre, isPlaying, playGenreTrack } = useAudioStore()

  return (
    <div className="flex flex-col gap-2">
      <ul className="space-y-1 text-[12px] leading-5 tracking-[-0.24px] text-[#545454]">
        {visibleGenres.map((item, index) => {
          const cleanName = item.replace(/^\d+\.\s*/, "").trim()
          const isCurrentPlaying = playingGenre === cleanName

          return (
            <li
              key={index}
              onClick={() => playGenreTrack(item)}
              className={`py-2 px-2 rounded cursor-pointer border-b border-neutral-100 last:border-0 transition-colors flex items-center justify-between ${
                isCurrentPlaying
                  ? "bg-black text-white font-medium shadow-sm"
                  : "hover:bg-neutral-100 text-[#545454] hover:text-black"
              }`}
            >
              <span className="truncate">{item}</span>

              {isCurrentPlaying && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold shrink-0 ml-2">
                  {isPlaying ? "▶ PLAYING" : "PAUSED"}
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <div className="py-3 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="text-[11px] font-mono font-medium px-4 py-1.5 border border-neutral-300 rounded hover:bg-black hover:text-white transition-colors"
          >
            + Load {genreListLength - visibleGenres.length} more genres
          </button>
        </div>
      )}
    </div>
  )
}
