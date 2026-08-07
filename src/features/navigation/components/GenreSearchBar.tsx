"use client"

import React from "react"
import { Search } from "lucide-react"
import { useGenreFilterStore } from "@/features/genres/store/useGenreFilterStore"

export function GenreSearchBar() {
  const { genreFilter, setGenreFilter } = useGenreFilterStore()

  return (
    <div className="relative w-full max-w-[150px] sm:max-w-[200px] shrink-0">
      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        placeholder="Search genres..."
        className="w-full pl-7 pr-2 py-1 text-[11px] sm:text-[12px] outline-none bg-transparent border-b border-neutral-200 focus:border-black transition-colors"
      />
    </div>
  )
}
