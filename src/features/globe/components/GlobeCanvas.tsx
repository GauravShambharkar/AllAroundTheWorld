"use client"

import React from "react"

interface GlobeCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerLeave: () => void
}

export function GlobeCanvas({
  canvasRef,
  onPointerDown,
  onPointerMove,
  onPointerLeave,
}: GlobeCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        opacity: 0,
        transition: "opacity 0.8s ease",
        borderRadius: "50%",
        touchAction: "none",
      }}
    />
  )
}
