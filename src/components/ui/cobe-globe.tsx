"use client"

import { useGlobeInteraction } from "@/features/globe/hooks/useGlobeInteraction"
import { useGlobeInstance } from "@/features/globe/hooks/useGlobeInstance"
import { GlobeCanvas } from "@/features/globe/components/GlobeCanvas"
import { GlobeTooltip } from "@/features/globe/components/GlobeTooltip"
import { GlobeMarkerBadge } from "@/features/globe/components/GlobeMarkerBadge"

export { type LocationSelection } from "@/features/globe/data/regionCoordinates"

interface GlobeProps {
  className?: string
}

export function Globe({ className = "" }: GlobeProps) {
  const {
    containerRef,
    canvasRef,
    isPausedRef,
    phiOffsetRef,
    thetaOffsetRef,
    dragOffset,
    velocity,
    currentPhiRef,
    currentThetaRef,
    selectedMarkerRef,
    selectedMarker,
    hoveredMarker,
    tooltipPos,
    handlePointerDown,
    handleMouseMove,
    handlePointerMove,
    handlePointerUp,
    clearHover,
  } = useGlobeInteraction()

  useGlobeInstance({
    canvasRef,
    containerRef,
    isPausedRef,
    phiOffsetRef,
    thetaOffsetRef,
    dragOffset,
    velocity,
    currentPhiRef,
    currentThetaRef,
    selectedMarkerRef,
    handlePointerMove,
    handlePointerUp,
  })

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none ${className}`}
    >
      <GlobeCanvas
        canvasRef={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handleMouseMove}
        onPointerLeave={clearHover}
      />

      {/* Region Hover Tooltip Card */}
      <GlobeTooltip hoveredMarker={hoveredMarker} tooltipPos={tooltipPos} />

      {/* Selected Active Marker Badge Overlay */}
      <GlobeMarkerBadge selectedMarker={selectedMarker} />
    </div>
  )
}
