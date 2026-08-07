"use client"

import React, { useState } from "react"
import { Search, X } from "lucide-react"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"
import { TabSwitcher } from "@/features/navigation/components/TabSwitcher"

export function MobileSearchExpander() {
  const { regionFilter, setRegionFilter } = useNavigationStore()
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false)

  return (
    <div className="md:hidden flex items-center gap-3 flex-1 justify-end">
      {isMobileSearchExpanded ? (
        /* Full Width Expanded Mobile Search Input */
        <div className="relative w-full flex items-center transition-all duration-300">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            autoFocus
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            placeholder="search regions..."
            className="w-full pl-9 pr-8 py-2 text-[13px] outline-none bg-neutral-50 border-b-2 border-black transition-all"
          />
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchExpanded(false)
              setRegionFilter("")
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Collapsed State: Map | Region + Search Icon beside Region */
        <div className="flex items-center gap-4 text-[16px] tracking-[-0.8px]">
          <TabSwitcher className="gap-4" />

          {/* Search Icon button beside Region item */}
          <button
            type="button"
            onClick={() => setIsMobileSearchExpanded(true)}
            className="p-1.5 text-neutral-600 hover:text-black transition-colors rounded-full hover:bg-neutral-100 flex items-center justify-center"
            title="search regions"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
