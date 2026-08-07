"use client"

import { LocationSelection } from "@/features/globe/data/regionCoordinates"

interface GlobeMarkerBadgeProps {
  selectedMarker: LocationSelection | null
}

export function GlobeMarkerBadge({ selectedMarker }: GlobeMarkerBadgeProps) {
  if (!selectedMarker) return null

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-neutral-200 px-3 py-1 rounded-full text-[11px] font-medium text-black shadow-sm flex items-center gap-2 pointer-events-none">
      <span className="w-2 h-2 rounded-full bg-black"></span>
      <span>{selectedMarker.name}</span>
    </div>
  )
}
