"use client"

import React, { useState, useMemo } from "react"
import { useGenreStore } from "@/store/useGenreStore"
import { getGenresForRegion, getMicrogenreCount } from "@/data/music-genres"
import { Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react"

interface SubregionItem {
  id: string
  label: string
  categoryKey: string
  subItems?: SubregionItem[]
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
      {
        id: "south-asia",
        label: "South Asia",
        categoryKey: "South Asia",
        subItems: [
          { id: "north-india-punjab", label: "North India & Punjab", categoryKey: "North India & Punjab" },
          { id: "south-india-dravida", label: "South India (Dravida)", categoryKey: "South India" },
          { id: "west-india-maharashtra", label: "West India (Maharashtra & Gujarat)", categoryKey: "West India" },
          { id: "east-northeast-india", label: "East & Northeast India (Bengal & Assam)", categoryKey: "East & Northeast India" },
          { id: "central-gangetic", label: "Central & Gangetic Plains", categoryKey: "Central & Gangetic Plains" },
          { id: "pakistan-northwest", label: "Pakistan & Northwest", categoryKey: "Pakistan & Northwest" },
        ],
      },
      { id: "east-asia", label: "East Asia", categoryKey: "East Asia" },
      { id: "southeast-asia", label: "Southeast Asia", categoryKey: "Southeast Asia" },
      { id: "central-asia", label: "Central Asia", categoryKey: "Central Asia" },
      { id: "west-asia", label: "West Asia (Middle East)", categoryKey: "West Asia" },
    ],
  },
  {
    continent: "Europe",
    items: [
      { id: "western-europe", label: "Western Europe", categoryKey: "Europe" },
      { id: "nordic-europe", label: "Nordic & Scandinavian Europe", categoryKey: "Europe" },
      { id: "southern-europe", label: "Southern Europe & Mediterranean", categoryKey: "Europe" },
      { id: "eastern-europe", label: "Eastern Europe & Balkans", categoryKey: "Europe" },
      { id: "celtic-isles", label: "Celtic Isles (Ireland/Scotland)", categoryKey: "Celtic" },
    ],
  },
  {
    continent: "North America",
    items: [
      { id: "us-deep-south", label: "US Deep South & Delta", categoryKey: "Blues" },
      { id: "us-appalachia", label: "Appalachia & Country", categoryKey: "Country" },
      { id: "us-urban-east-west", label: "US Urban East/West Coast", categoryKey: "Hip-Hop" },
      { id: "canada-nordic", label: "Canada & Northern Coast", categoryKey: "North America" },
    ],
  },
  {
    continent: "South America",
    items: [
      { id: "brazil-atlantic", label: "Brazil (Atlantic Coast)", categoryKey: "Samba" },
      { id: "andean-region", label: "Andean Region (Peru, Bolivia)", categoryKey: "Cumbia" },
      { id: "rio-de-la-plata", label: "Río de la Plata (Argentina, Uruguay)", categoryKey: "Tango" },
    ],
  },
  {
    continent: "Caribbean",
    items: [
      { id: "greater-antilles", label: "Greater Antilles (Jamaica, Cuba, PR)", categoryKey: "Reggae" },
      { id: "lesser-antilles", label: "Lesser Antilles & Trinidad", categoryKey: "Soca" },
    ],
  },
  {
    continent: "Oceania",
    items: [
      { id: "indigenous-australia", label: "Indigenous Australia & Bush", categoryKey: "Indigenous" },
      { id: "polynesia-maori", label: "Polynesia & Māori (NZ)", categoryKey: "Māori" },
    ],
  },
]

export function RegionView() {
  const setSelectedRegion = useGenreStore((state) => state.setSelectedRegion)
  const selectedGenre = useGenreStore((state) => state.selectedGenre)
  const regionFilter = useGenreStore((state) => state.regionFilter)

  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({
    Asia: true,
    Europe: true,
  })

  const [expandedSubItems, setExpandedSubItems] = useState<Record<string, boolean>>({
    "south-asia": true,
  })

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

  const [isLoadingApi, setIsLoadingApi] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)

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

  return (
    <div className="w-full h-full flex flex-col select-none text-black">
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
                    onClick={() => handleSelectCategory(group.continent, group.continent, group.continent)}
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
                    const isSubExpanded = expandedSubItems[item.id] ?? false

                    return (
                      <li key={item.id} className="flex flex-col">
                        <div
                          onClick={() => handleSelectCategory(item.categoryKey, item.label, group.continent)}
                          className={`cursor-pointer transition-colors flex items-center justify-between py-1 px-1 rounded ${
                            isSelected
                              ? "font-bold text-black bg-neutral-100 underline decoration-2"
                              : "hover:underline"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>
                              • {item.label}
                            </span>
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {loadingCategory === item.label ? (
                                <Loader2 className="w-3 h-3 animate-spin text-black" />
                              ) : (
                                `(${count})`
                              )}
                            </span>
                            {item.subItems && (
                              <button
                                type="button"
                                onClick={(e) => toggleSubItemExpand(item.id, e)}
                                className="text-neutral-400 hover:text-black p-0.5"
                                title="Toggle subregions"
                              >
                                {isSubExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Nested Dropdown Sub-Items */}
                        {item.subItems && isSubExpanded && (
                          <ul className="pl-4 space-y-1 mt-0.5 border-l border-neutral-200 ml-2">
                            {item.subItems.map((sub, sIdx) => {
                              const subCount = getMicrogenreCount(sub.categoryKey)
                              const isSubSelected =
                                selectedGenre === sub.label || selectedGenre === sub.categoryKey

                              return (
                                <li
                                  key={sub.id}
                                  onClick={() => handleSelectCategory(sub.categoryKey, sub.label, group.continent)}
                                  className={`cursor-pointer transition-colors flex items-center justify-between py-0.5 px-1 rounded text-[11px] ${
                                    isSubSelected
                                      ? "font-bold text-black bg-neutral-100 underline"
                                      : "text-neutral-600 hover:text-black hover:underline"
                                  }`}
                                >
                                  <span className="truncate">
                                    {idx + 1}.{sIdx + 1} {sub.label}
                                  </span>
                                  <span className="text-[9px] text-neutral-400 font-mono shrink-0 ml-1">
                                    {loadingCategory === sub.label ? (
                                      <Loader2 className="w-2.5 h-2.5 animate-spin text-black" />
                                    ) : (
                                      `(${subCount})`
                                    )}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        )}
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
