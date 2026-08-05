"use client";

import React, { useState } from "react";
import { useGenreStore } from "@/store/useGenreStore";
import { Search, X } from "lucide-react";

export function NavigationHeader() {
  const {
    activeTab,
    setActiveTab,
    selectedGenre,
    selectedContinent,
    regionFilter,
    setRegionFilter,
    genreFilter,
    setGenreFilter,
    stopAudio,
    setSelectedRegion,
  } = useGenreStore();

  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  return (
    <header className="w-full bg-white text-black select-none">
      {/* Top Header Row: Logo Badge on Left + Tab & Search Navigation on Right */}
      <div className="flex items-center justify-between mb-4 gap-4">
        {/* Left: Brand Badge Logo */}
        {!isMobileSearchExpanded && (
          <div className="p-1.5 pl-2 pr-0 bg-black w-fit border shrink-0">
            <div className="bg-black text-white flex items-center justify-between gap-4 font-semibold text-[12px] leading-tight tracking-[-0.6px] shadow-sm min-w-[72px] h-[48px]">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span>All</span>
                  <div className="w-full h-[10px] bg-white"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span>Around</span>
                  <div className="w-[12px] h-[10px] bg-white"></div>
                </div>
                <span>The World</span>
              </div>
            </div>
          </div>
        )}

        {/* Right: Mobile-Only Header Controls (< md) with Expandable Search beside Region item */}
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
                  setIsMobileSearchExpanded(false);
                  setRegionFilter("");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Collapsed State: Map | Region + Search Icon beside Region */
            <div className="flex items-center gap-4 text-[16px] tracking-[-0.8px]">
              <button
                type="button"
                onClick={() => setActiveTab("map")}
                className={`transition-colors outline-none focus:outline-none ${
                  activeTab === "map"
                    ? "text-black underline underline-offset-4 decoration-2 font-medium"
                    : "text-[#545454] hover:text-black font-normal"
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("region")}
                className={`transition-colors outline-none focus:outline-none ${
                  activeTab === "region"
                    ? "text-black underline underline-offset-4 decoration-2 font-medium"
                    : "text-[#545454] hover:text-black font-normal"
                }`}
              >
                Region
              </button>

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
      </div>

      {/* Main Header Rows */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Left Column Header Controls (Desktop Search Bar) */}
        <div className="flex-1 border-b border-dotted border-[#545454] pb-3 md:pb-4 flex items-center justify-end md:justify-between gap-4 min-h-[36px]">
          {/* Desktop Tabs (>= md) */}
          <div className="hidden md:flex items-center gap-6 text-[16px] tracking-[-0.8px]">
            <button
              type="button"
              onClick={() => setActiveTab("map")}
              className={`transition-colors outline-none focus:outline-none ${
                activeTab === "map"
                  ? "text-black underline underline-offset-4 decoration-2 font-medium"
                  : "text-[#545454] hover:text-black font-normal"
              }`}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("region")}
              className={`transition-colors outline-none focus:outline-none ${
                activeTab === "region"
                  ? "text-black underline underline-offset-4 decoration-2 font-medium"
                  : "text-[#545454] hover:text-black font-normal"
              }`}
            >
              Region
            </button>
          </div>

          {/* Desktop Search Regions Bar */}
          {activeTab === "region" ? (
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
          ) : null}
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

          {/* Search Genres input — placed beside selected region header */}
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
        </div>
      </div>
    </header>
  );
}
