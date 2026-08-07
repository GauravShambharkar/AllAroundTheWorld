"use client"

import React from "react"
import { useGenreSearch } from "@/features/genres/hooks/useGenreSearch"
import { MobileBackBar } from "@/features/genres/components/MobileBackBar"
import { AudioPlayerBanner } from "@/features/genres/components/AudioPlayerBanner"
import { GenreListFeed } from "@/features/genres/components/GenreListFeed"
import { EmptyGenrePlaceholder } from "@/features/genres/components/EmptyGenrePlaceholder"

export function GenreListPanel() {
  const {
    genreList,
    visibleGenres,
    hasMore,
    loadMore,
  } = useGenreSearch()

  return (
    <div className="w-full h-full flex flex-col gap-4 select-none">
      {/* Mobile Top Control Row */}
      <MobileBackBar />

      {/* Active Audio Playing Banner */}
      <AudioPlayerBanner />

      {/* Genre List Feed or Empty Placeholder */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {genreList.length === 0 ? (
          <EmptyGenrePlaceholder />
        ) : (
          <GenreListFeed
            visibleGenres={visibleGenres}
            genreListLength={genreList.length}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </div>
  )
}
