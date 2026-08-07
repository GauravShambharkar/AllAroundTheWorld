"use client"

import { LocationSelection } from "@/features/globe/data/regionCoordinates"

interface GlobeTooltipProps {
  hoveredMarker: LocationSelection | null
  tooltipPos: { x: number; y: number } | null
}

export function GlobeTooltip({ hoveredMarker, tooltipPos }: GlobeTooltipProps) {
  if (!hoveredMarker || !tooltipPos) return null

  return (
    <div
      className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-black text-white px-3 py-1.5 rounded shadow-lg flex flex-col gap-0.5 whitespace-nowrap transition-all duration-150 border border-neutral-700"
      style={{
        left: `${tooltipPos.x}px`,
        top: `${tooltipPos.y}px`,
      }}
    >
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-tight">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span>{hoveredMarker.name}</span>
      </div>
      <div className="text-[10px] text-neutral-300 font-mono">
        {hoveredMarker.genres.length} subgenres • Click to explore
      </div>
    </div>
  )
}
