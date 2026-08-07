"use client"

import { useState, useMemo } from "react"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"
import { getGenresForRegion } from "@/data/music-genres"
import { REGION_STRUCTURE } from "@/features/regions/data/regionStructure"

export function useRegionSelection() {
  const { setSelectedRegion, selectedGenre, regionFilter } = useNavigationStore()

  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({
    Asia: true,
    Europe: true,
  })

  const [expandedSubItems, setExpandedSubItems] = useState<Record<string, boolean>>({
    "south-asia": true,
  })

  const [isLoadingApi, setIsLoadingApi] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)

  const toggleExpand = (continent: string) => {
    setExpandedContinents((prev) => ({
      ...prev,
      [continent]: !prev[continent],
    }))
  }

  const toggleSubItemExpand = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedSubItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const handleSelectCategory = async (key: string, displayLabel?: string, continent?: string) => {
    const activeLabel = displayLabel || key
    setIsLoadingApi(true)
    setLoadingCategory(activeLabel)
    const local = getGenresForRegion(key)
    try {
      const res = await fetch(`/api/genres?region=${encodeURIComponent(key)}&limit=1000`)
      if (res.ok) {
        const data = await res.json()
        if (data.genres && data.genres.length > 0) {
          const combinedMap = new Map<string, string>()
          local.forEach((g) => combinedMap.set(g.replace(/^\d+\.\s*/, "").toLowerCase(), g))
          data.genres.forEach((g: string) => {
            const clean = g.replace(/^\d+\.\s*/, "").toLowerCase()
            if (!combinedMap.has(clean)) {
              combinedMap.set(clean, g)
            }
          })
          const finalGenres = Array.from(combinedMap.values()).map(
            (g, i) => `${i + 1}. ${g.replace(/^\d+\.\s*/, "")}`
          )
          setSelectedRegion(activeLabel, finalGenres, continent || activeLabel)
          return
        }
      }
    } catch (err) {
      console.error("Dynamic region fetch error:", err)
    } finally {
      setIsLoadingApi(false)
      setLoadingCategory(null)
    }
    setSelectedRegion(activeLabel, local, continent || activeLabel)
  }

  // Filter region list based on user search query
  const filteredStructure = useMemo(() => {
    if (!regionFilter.trim()) return REGION_STRUCTURE

    const q = regionFilter.toLowerCase()
    return REGION_STRUCTURE.map((group) => {
      const matchContinent = group.continent.toLowerCase().includes(q)
      const matchingItems = group.items.filter((item) =>
        item.label.toLowerCase().includes(q) ||
        item.categoryKey.toLowerCase().includes(q) ||
        item.subItems?.some((sub) => sub.label.toLowerCase().includes(q) || sub.categoryKey.toLowerCase().includes(q))
      )

      if (matchContinent) return group
      return {
        ...group,
        items: matchingItems,
      }
    }).filter((group) => group.items.length > 0 || group.continent.toLowerCase().includes(q))
  }, [regionFilter])

  return {
    selectedGenre,
    expandedContinents,
    expandedSubItems,
    loadingCategory,
    filteredStructure,
    toggleExpand,
    toggleSubItemExpand,
    handleSelectCategory,
  }
}
