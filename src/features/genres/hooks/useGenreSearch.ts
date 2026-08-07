"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"
import { useGenreFilterStore } from "@/features/genres/store/useGenreFilterStore"

export function useGenreSearch() {
  const { activeGenreList: genreList, setSelectedRegion } = useNavigationStore()
  const { genreFilter, setGenreFilter } = useGenreFilterStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchingApi, setIsSearchingApi] = useState(false)
  const [visibleLimit, setVisibleLimit] = useState(80)

  useEffect(() => {
    setVisibleLimit(80)
  }, [genreList])

  // Live dynamic search against server API (/api/genres)
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setSearchQuery(q)
    setGenreFilter(q)

    if (!q.trim()) return

    setIsSearchingApi(true)
    try {
      const res = await fetch(`/api/genres?query=${encodeURIComponent(q)}&limit=100`)
      if (res.ok) {
        const data = await res.json()
        if (data.genres && data.genres.length > 0) {
          setSelectedRegion(
            `Search: "${q}" (${data.total} results)`,
            data.genres,
          )
        }
      }
    } catch (err) {
      console.error("Live API search error:", err)
    } finally {
      setIsSearchingApi(false)
    }
  }

  // Filter genre list by genreFilter from header
  const filteredGenres = useMemo(() => {
    const q = (genreFilter || searchQuery).trim().toLowerCase()
    if (!q) return genreList
    return genreList.filter((g) => g.toLowerCase().includes(q))
  }, [genreList, genreFilter, searchQuery])

  const visibleGenres = filteredGenres.slice(0, visibleLimit)
  const hasMore = visibleLimit < filteredGenres.length

  const loadMore = () => setVisibleLimit((prev) => prev + 100)

  return {
    searchQuery,
    isSearchingApi,
    genreList,
    filteredGenres,
    visibleGenres,
    hasMore,
    handleSearchChange,
    loadMore,
  }
}
