"use client"

import React, { useState, useMemo } from "react"
import { useGenreStore } from "@/store/useGenreStore"
import { getGenresForRegion, getMicrogenreCount } from "@/data/music-genres"
import { Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react"

interface SubregionItem {
  id: string
  label: string
  categoryKey: string
}

interface RegionGroup {
  continent: string
  items: SubregionItem[]
}

const REGION_STRUCTURE: RegionGroup[] = [
  {
    continent: "Africa",
    items: [
      { id: "west-africa", label: "West Africa", categoryKey: "West Africa" },
      { id: "south-africa", label: "Southern Africa", categoryKey: "Southern Africa" },
      { id: "north-africa", label: "North Africa", categoryKey: "North Africa" },
      { id: "east-africa", label: "East Africa", categoryKey: "East Africa" },
      { id: "central-africa", label: "Central Africa", categoryKey: "Central Africa" },
    ],
  },
  {
    continent: "Asia",
    items: [
      { id: "east-asia", label: "East Asia", categoryKey: "East Asia" },
      { id: "south-asia", label: "South Asia", categoryKey: "South Asia" },
      { id: "southeast-asia", label: "Southeast Asia", categoryKey: "Southeast Asia" },
      { id: "central-asia", label: "Central Asia", categoryKey: "Central Asia" },
      { id: "west-asia", label: "West Asia (Middle East)", categoryKey: "West Asia" },
    ],
  },
  {
    continent: "Europe",
    items: [
      { id: "classical", label: "Classical", categoryKey: "Classical" },
      { id: "opera", label: "Opera", categoryKey: "Opera" },
      { id: "flamenco", label: "Flamenco (Spain)", categoryKey: "Flamenco" },
      { id: "fado", label: "Fado (Portugal)", categoryKey: "Fado" },
      { id: "celtic", label: "Celtic (Ireland/Scotland)", categoryKey: "Celtic" },
      { id: "polka", label: "Polka", categoryKey: "Polka" },
      { id: "edm", label: "EDM (Modern Europe)", categoryKey: "Modern Europe" },
    ],
  },
  {
    continent: "North America",
    items: [
      { id: "blues", label: "Blues", categoryKey: "Blues" },
      { id: "jazz", label: "Jazz", categoryKey: "Jazz" },
      { id: "country", label: "Country", categoryKey: "Country" },
      { id: "rock", label: "Rock", categoryKey: "Rock" },
      { id: "hiphop", label: "Hip-Hop", categoryKey: "Hip-Hop" },
      { id: "house", label: "House", categoryKey: "House" },
    ],
  },
  {
    continent: "South America",
    items: [
      { id: "samba", label: "Samba", categoryKey: "Samba" },
      { id: "bossa-nova", label: "Bossa Nova", categoryKey: "Bossa Nova" },
      { id: "tango", label: "Tango", categoryKey: "Tango" },
      { id: "cumbia", label: "Cumbia", categoryKey: "Cumbia" },
    ],
  },
  {
    continent: "Caribbean",
    items: [
      { id: "reggae", label: "Reggae", categoryKey: "Reggae" },
      { id: "dancehall", label: "Dancehall", categoryKey: "Dancehall" },
      { id: "calypso", label: "Calypso", categoryKey: "Calypso" },
      { id: "soca", label: "Soca", categoryKey: "Soca" },
    ],
  },
  {
    continent: "Oceania",
    items: [
      { id: "indigenous-aus", label: "Indigenous Australian Music", categoryKey: "Indigenous" },
      { id: "maori", label: "Māori Music", categoryKey: "Māori" },
      { id: "aussie-rock", label: "Contemporary Australian Rock/Pop", categoryKey: "Australian" },
    ],
  },
]

export function RegionView() {
  const setSelectedRegion = useGenreStore((state) => state.setSelectedRegion)
  const selectedGenre = useGenreStore((state) => state.selectedGenre)

  const [regionFilter, setRegionFilter] = useState("")
  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({
    Asia: true,
    Europe: true,
  })

  const toggleExpand = (continent: string) => {
    setExpandedContinents((prev) => ({
      ...prev,
      [continent]: !prev[continent],
    }))
  }

  const [isLoadingApi, setIsLoadingApi] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)

  const handleSelectCategory = async (name: string, continent?: string) => {
    setIsLoadingApi(true)
    setLoadingCategory(name)
    const local = getGenresForRegion(name)
    try {
      const res = await fetch(`/api/genres?region=${encodeURIComponent(name)}&limit=1000`)
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
          setSelectedRegion(name, finalGenres, continent || name)
          return
        }
      }
    } catch (err) {
      console.error("Dynamic region fetch error:", err)
    } finally {
      setIsLoadingApi(false)
      setLoadingCategory(null)
    }
    setSelectedRegion(name, local, continent || name)
  }

  // Filter region list based on user search query
  const filteredStructure = useMemo(() => {
    if (!regionFilter.trim()) return REGION_STRUCTURE

    const q = regionFilter.toLowerCase()
    return REGION_STRUCTURE.map((group) => {
      const matchContinent = group.continent.toLowerCase().includes(q)
      const matchingItems = group.items.filter((item) =>
        item.label.toLowerCase().includes(q)
      )

      if (matchContinent) return group
      return {
        ...group,
        items: matchingItems,
      }
    }).filter((group) => group.items.length > 0 || group.continent.toLowerCase().includes(q))
  }, [regionFilter])

  return (
    <div className="w-full h-full flex flex-col gap-4 select-none text-black">
      {/* Search Bar — right-aligned, reduced width */}
      <div className="flex justify-end">
        <div className="relative w-full max-w-[256px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            placeholder="Filter regions & subgenres..."
            className="w-full pl-8 pr-4 py-2 text-[12px] outline-none bg-transparent border-b border-neutral-200 focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Optimized Region & Subgenre Scroll Feed */}
      <div className="flex-1 overflow-y-auto pr-1 text-[12px] leading-5 tracking-[-0.24px] custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {filteredStructure.map((group) => {
            const isExpanded = expandedContinents[group.continent] ?? true
            const totalCount = getMicrogenreCount(group.continent)
            const visibleItems = isExpanded ? group.items : group.items.slice(0, 3)
            const isContinentSelected = selectedGenre === group.continent

            return (
              <div key={group.continent} className="flex flex-col">
                {/* Continent Parent Heading */}
                <div className="flex items-center justify-between group">
                  <h3
                    onClick={() => handleSelectCategory(group.continent, group.continent)}
                    className={`uppercase mb-1 cursor-pointer transition-colors flex-1 ${
                      isContinentSelected
                        ? "font-bold text-black underline decoration-2"
                        : "font-semibold text-black hover:underline"
                    }`}
                  >
                    {group.continent}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400 font-mono font-normal">
                      ({totalCount})
                    </span>
                    {group.items.length > 3 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(group.continent)}
                        className="text-neutral-400 hover:text-black p-1"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subregion Items List */}
                <ul className="pl-2 space-y-1 text-[#000000]">
                  {visibleItems.map((item, idx) => {
                    const count = getMicrogenreCount(item.categoryKey)
                    const isSelected =
                      selectedGenre === item.label || selectedGenre === item.categoryKey

                    return (
                      <li
                        key={item.id}
                        onClick={() => handleSelectCategory(item.label, group.continent)}
                        className={`cursor-pointer transition-colors flex items-center justify-between py-1 px-1 rounded ${
                          isSelected
                            ? "font-bold text-black bg-neutral-100 underline decoration-2"
                            : "hover:underline"
                        }`}
                      >
                        <span>
                          {idx + 1}. {item.label}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                          {loadingCategory === item.label ? (
                            <Loader2 className="w-3 h-3 animate-spin text-black" />
                          ) : (
                            `(${count})`
                          )}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {/* Load More Indicator if Collapsed */}
                {!isExpanded && group.items.length > 3 && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(group.continent)}
                    className="text-[10px] text-neutral-500 hover:text-black font-mono mt-1 text-left pl-2 underline"
                  >
                    + Load {group.items.length - 3} more
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
