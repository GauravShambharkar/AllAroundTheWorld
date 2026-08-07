"use client"

import React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ContinentGroupProps {
  continent: string
  totalCount: number
  isExpanded: boolean
  isContinentSelected: boolean
  hasMoreThan3: boolean
  onSelect: () => void
  onToggleExpand: () => void
  children: React.ReactNode
}

export function ContinentGroup({
  continent,
  totalCount,
  isExpanded,
  isContinentSelected,
  hasMoreThan3,
  onSelect,
  onToggleExpand,
  children,
}: ContinentGroupProps) {
  return (
    <div className="flex flex-col">
      {/* Continent Parent Heading */}
      <div className="flex items-center justify-between group">
        <h3
          onClick={onSelect}
          className={`uppercase mb-1 cursor-pointer transition-colors flex-1 ${
            isContinentSelected
              ? "font-bold text-black underline decoration-2"
              : "font-semibold text-black hover:underline"
          }`}
        >
          {continent}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-400 font-mono font-normal">
            ({totalCount})
          </span>
          {hasMoreThan3 && (
            <button
              type="button"
              onClick={onToggleExpand}
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
      <ul className="pl-2 space-y-1 text-[#000000]">{children}</ul>

      {/* Load More Indicator if Collapsed */}
      {!isExpanded && hasMoreThan3 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="text-[10px] text-neutral-500 hover:text-black font-mono mt-1 text-left pl-2 underline"
        >
          + Load More
        </button>
      )}
    </div>
  )
}
