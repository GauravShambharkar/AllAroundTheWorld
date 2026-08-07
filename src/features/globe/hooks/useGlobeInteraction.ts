"use client"

import { useRef, useCallback, useState } from "react"
import { REGION_COORDINATE_MAP, LocationSelection } from "@/features/globe/data/regionCoordinates"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"

export function useGlobeInteraction() {
  const { setSelectedRegion } = useNavigationStore()

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const currentPhiRef = useRef(0)
  const currentThetaRef = useRef(0.2)

  const selectedMarkerRef = useRef<LocationSelection>(REGION_COORDINATE_MAP[0])
  const [selectedMarker, setSelectedMarkerState] = useState<LocationSelection>(REGION_COORDINATE_MAP[0])
  const [hoveredMarker, setHoveredMarker] = useState<LocationSelection | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const setSelectedMarker = (marker: LocationSelection) => {
    selectedMarkerRef.current = marker
    setSelectedMarkerState(marker)
  }

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handleMouseMove = useCallback((e: React.PointerEvent) => {
    if (!canvasRef.current || pointerInteracting.current !== null) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const r = rect.width / 2
    const cx = r
    const cy = r
    const dx = (x - cx) / r
    const dy = (y - cy) / r

    if (dx * dx + dy * dy <= 1) {
      const dz = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy))
      const phi = currentPhiRef.current
      const cosPhi = Math.cos(phi)
      const sinPhi = Math.sin(phi)

      const wx = dx * cosPhi - dz * sinPhi
      const wz = dx * sinPhi + dz * cosPhi
      const wy = -dy

      const clickedLat = Math.asin(Math.max(-1, Math.min(1, wy))) * (180 / Math.PI)
      const clickedLng = Math.atan2(wz, wx) * (180 / Math.PI)

      let closest: LocationSelection | null = null
      let minDist = 400 // threshold

      for (const rItem of REGION_COORDINATE_MAP) {
        const dLat = rItem.lat - clickedLat
        const dLng = rItem.lng - clickedLng
        const dist = dLat * dLat + dLng * dLng
        if (dist < minDist) {
          minDist = dist
          closest = rItem
        }
      }

      if (closest && minDist < 350) {
        setHoveredMarker(closest)
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 12 })
      } else {
        setHoveredMarker(null)
        setTooltipPos(null)
      }
    } else {
      setHoveredMarker(null)
      setTooltipPos(null)
    }
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x
      const deltaY = e.clientY - pointerInteracting.current.y
      dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 }
      const now = Date.now()
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1)
        const maxVelocity = 0.15
        velocity.current = {
          phi: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientX - lastPointer.current.x) / dt) * 0.3)
          ),
          theta: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientY - lastPointer.current.y) / dt) * 0.08)
          ),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
  }, [])

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        const deltaX = Math.abs(e.clientX - pointerInteracting.current.x)
        const deltaY = Math.abs(e.clientY - pointerInteracting.current.y)

        if (deltaX < 5 && deltaY < 5 && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const r = rect.width / 2
          const cx = r
          const cy = r
          const dx = (x - cx) / r
          const dy = (y - cy) / r

          if (dx * dx + dy * dy <= 1) {
            const dz = Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy))
            const phi = currentPhiRef.current
            const cosPhi = Math.cos(phi)
            const sinPhi = Math.sin(phi)

            const wx = dx * cosPhi - dz * sinPhi
            const wz = dx * sinPhi + dz * cosPhi
            const wy = -dy

            const clickedLat = Math.asin(Math.max(-1, Math.min(1, wy))) * (180 / Math.PI)
            const clickedLng = Math.atan2(wz, wx) * (180 / Math.PI)

            let closest = REGION_COORDINATE_MAP[0]
            let minDist = Infinity

            for (const rItem of REGION_COORDINATE_MAP) {
              const dLat = rItem.lat - clickedLat
              const dLng = rItem.lng - clickedLng
              const dist = dLat * dLat + dLng * dLng
              if (dist < minDist) {
                minDist = dist
                closest = rItem
              }
            }

            setSelectedMarker(closest)
            const continentName = closest.name.includes("Asia")
              ? "Asia"
              : closest.name.includes("Europe")
              ? "Europe"
              : closest.name.includes("Africa")
              ? "Africa"
              : closest.name.includes("America")
              ? "North America"
              : closest.name;
            setSelectedRegion(closest.name, closest.genres, continentName)
          }
        }

        phiOffsetRef.current += dragOffset.current.phi
        thetaOffsetRef.current += dragOffset.current.theta
        dragOffset.current = { phi: 0, theta: 0 }
        lastPointer.current = null
      }
      pointerInteracting.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = "grab"
      isPausedRef.current = false
    },
    [setSelectedRegion]
  )

  return {
    // Refs
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

    // State
    selectedMarker,
    hoveredMarker,
    tooltipPos,

    // Handlers
    handlePointerDown,
    handleMouseMove,
    handlePointerMove,
    handlePointerUp,

    // Tooltip dismiss
    clearHover: () => {
      setHoveredMarker(null)
      setTooltipPos(null)
    },
  }
}
