"use client";

import React from "react";
import { useGenreStore } from "@/store/useGenreStore";

export function NavigationHeader() {
  const activeTab = useGenreStore((state) => state.activeTab);
  const setActiveTab = useGenreStore((state) => state.setActiveTab);

  const selectedGenre = useGenreStore((state) => state.selectedGenre);
  const selectedContinent = useGenreStore((state) => state.selectedContinent);

  return (
    <header className="w-full bg-white text-black select-none">
      {/* Brand Badge (Exact Figma WebIcon Component) */}
      <div className="flex items-center mb-4 p-1.5 pl-2 pr-0 bg-black w-fit border">
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

      {/* Tabs + List Of Genres Header Row (aligned on same baseline) */}
      <div className="flex gap-8">
        {/* Left: Map / Region Tabs with dotted border */}
        <div className="flex-1 border-b border-dotted border-[#545454] pb-4">
          <div className="flex items-center gap-6 text-[16px] tracking-[-0.8px]">
            <button
              type="button"
              onClick={() => setActiveTab("map")}
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
              onClick={() => setActiveTab("region")}
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

        {/* Right: List Of Genres heading with selected genre (Region) */}
        <div className="flex-1 border-b border-dotted border-[#545454] pb-4 flex items-center justify-between gap-4">
          <h2 className="text-[16px] font-medium text-black leading-[20px] tracking-[-0.8px] shrink-0">
            List Of Genres
          </h2>
          {selectedGenre && (
            <span className="text-[14px] text-[#545454] font-normal tracking-[-0.28px] truncate">
              <strong className="font-bold text-black">{selectedGenre}</strong>
              {selectedContinent && selectedContinent !== selectedGenre ? (
                <span> ({selectedContinent})</span>
              ) : null}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
