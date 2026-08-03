"use client";

import React from "react";
import { useGenreStore } from "@/store/useGenreStore";
import { Search } from "lucide-react";

export function NavigationHeader() {
  const activeTab = useGenreStore((state) => state.activeTab);
  const setActiveTab = useGenreStore((state) => state.setActiveTab);

  const selectedGenre = useGenreStore((state) => state.selectedGenre);
  const selectedContinent = useGenreStore((state) => state.selectedContinent);
  const regionFilter = useGenreStore((state) => state.regionFilter);
  const setRegionFilter = useGenreStore((state) => state.setRegionFilter);

  const stopAudio = useGenreStore((state) => state.stopAudio);
  const setSelectedRegion = useGenreStore((state) => state.setSelectedRegion);

  return (
    <header className="w-full bg-white text-black select-none">
      {/* Top Header Row: Logo Badge on Left + Map / Region Tabs on Right */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Brand Badge Logo */}
        <div className="p-1.5 pl-2 pr-0 bg-black w-fit border">
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

        {/* Right: Map / Region Tab Buttons (Aligned with Logo) */}
        <div className="flex items-center gap-6 text-[16px] tracking-[-0.8px]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("map");
            }}
            className={`transition-colors ${
              activeTab === "map"
                ? "text-black underline underline-offset-4 decoration-2 font-medium"
                : "text-[#545454] hover:text-black font-normal"
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("region");
              stopAudio();
              setSelectedRegion("", [], "");
            }}
            className={`transition-colors ${
              activeTab === "region"
                ? "text-black underline underline-offset-4 decoration-2 font-medium"
                : "text-[#545454] hover:text-black font-normal"
            }`}
          >
            Region
          </button>
        </div>
      </div>

      {/* Second Row: Search bar & Dotted Separator */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Left Column: Search Bar (when in Region mode) or Dotted Line */}
        <div className="flex-1 border-b border-dotted border-[#545454] pb-3 flex items-center justify-between min-h-[36px]">
          {activeTab === "region" ? (
            <div className="relative w-full max-w-[220px] sm:max-w-[256px]">
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

        {/* Right Column: List Of Genres heading with selected genre — Only shown on Region tab */}
        {activeTab === "region" && (
          <div className="flex-1 border-b border-dotted border-[#545454] pb-3 flex items-center justify-between gap-4">
            <h2 className="text-[16px] font-medium text-black leading-[20px] tracking-[-0.8px] shrink-0">
              List Of Genres
            </h2>
            {selectedGenre && (
              <span className="text-[13px] sm:text-[14px] text-[#545454] font-normal tracking-[-0.28px] truncate">
                <strong className="font-bold text-black">{selectedGenre}</strong>
                {selectedContinent && selectedContinent !== selectedGenre ? (
                  <span> ({selectedContinent})</span>
                ) : null}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
