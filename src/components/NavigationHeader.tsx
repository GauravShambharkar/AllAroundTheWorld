"use client"

import React from "react"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"
import { BrandBadge } from "@/features/navigation/components/BrandBadge"
import { TabSwitcher } from "@/features/navigation/components/TabSwitcher"
import { MobileSearchExpander } from "@/features/navigation/components/MobileSearchExpander"
import { RegionSearchBar } from "@/features/navigation/components/RegionSearchBar"
import { GenreSearchBar } from "@/features/navigation/components/GenreSearchBar"

export function NavigationHeader() {
  const {
    activeTab,
    selectedGenre,
    selectedContinent,
  } = useNavigationStore()

  return (
    <header className="w-full bg-white text-black select-none">
      {/* Top Header Row: Logo Badge on Left + Tab & Search Navigation on Right */}
      <div className="flex items-center justify-between mb-4 gap-4">
        {/* Left: Brand Badge Logo */}
        <BrandBadge />

        {/* Right: Mobile-Only Header Controls (< md) with Expandable Search beside Region item */}
        <MobileSearchExpander />
      </div>

      {/* Main Header Rows */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Left Column Header Controls (Desktop Search Bar) */}
        <div className="flex-1 border-b border-dotted border-[#545454] pb-3 md:pb-4 flex items-center justify-end md:justify-between gap-4 min-h-[36px]">
          {/* Desktop Tabs (>= md) */}
          <TabSwitcher className="hidden md:flex" />

          {/* Desktop Search Regions Bar */}
          <RegionSearchBar />
        </div>

        {/* Right Column Header: List Of Genres heading with selected region & Search Genres Bar beside header */}
        <div
          className={`flex-1 border-b border-dotted border-[#545454] pb-3 md:pb-4 flex items-center justify-between gap-3 ${
            activeTab === "map" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <h2 className="text-[16px] font-medium text-black leading-[20px] tracking-[-0.8px] shrink-0">
              List Of Genres
            </h2>
            {selectedGenre && (
              <span className="text-[12px] sm:text-[13px] text-[#545454] font-normal tracking-[-0.28px] truncate">
                :{" "}
                <strong className="font-medium underline underline-offset-4 decoration-2 text-black">
                  {selectedGenre}
                </strong>
                {selectedContinent && selectedContinent !== selectedGenre ? (
                  <span> ({selectedContinent})</span>
                ) : null}
              </span>
            )}
          </div>

          {/* Search Genres input + Year selector — placed beside selected region header */}
          <GenreSearchBar />
        </div>
      </div>
    </header>
  )
}
