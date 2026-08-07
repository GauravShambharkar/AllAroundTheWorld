"use client"

import React from "react"
import { Search } from "lucide-react"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"

export function RegionSearchBar() {
  const { activeTab, regionFilter, setRegionFilter } = useNavigationStore()

  if (activeTab !== "region") return null

  return (
    <div className="hidden md:block relative w-full max-w-[220px] sm:max-w-[256px]">
      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={regionFilter}
        onChange={(e) => setRegionFilter(e.target.value)}
        placeholder="search regions"
        className="w-full pl-7 pr-2 py-1 text-[12px] outline-none bg-transparent border-b border-neutral-200 focus:border-black transition-colors"
      />
    </div>
  )
}
