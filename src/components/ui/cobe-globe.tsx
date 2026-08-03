"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"
import { useGenreStore } from "@/store/useGenreStore"

import { getGenresForRegion } from "@/data/music-genres"

export interface LocationSelection {
  name: string
  lat: number
  lng: number
  genres: string[]
}

const REGION_COORDINATE_MAP: LocationSelection[] = [
  {
    name: "South Asia (India)",
    lat: 20.5937,
    lng: 78.9629,
    genres: getGenresForRegion("South Asia"),
  },
  {
    name: "East Asia (Japan / Korea)",
    lat: 36.2048,
    lng: 138.2529,
    genres: [
      "1. City Pop (Japan)",
      "2. K-Pop (Korea)",
      "3. Enka",
      "4. Gagaku Classical",
      "5. J-Rock",
      "6. Asian Lo-Fi Beats",
    ],
  },
  {
    name: "Southeast Asia (Indonesia / Thailand)",
    lat: 13.7563,
    lng: 100.5018,
    genres: [
      "1. Gamelan",
      "2. Luk Thung",
      "3. Dangdut",
      "4. Pinpeat",
      "5. Kroncong",
      "6. Thai Folk",
    ],
  },
  {
    name: "West Asia (Middle East)",
    lat: 29.3117,
    lng: 47.4818,
    genres: [
      "1. Maqam Classical",
      "2. Dabke",
      "3. Sufi Music",
      "4. Mizrahi",
      "5. Persian Dastgah",
      "6. Anatolian Rock",
    ],
  },
  {
    name: "Europe (Berlin / London / Paris)",
    lat: 52.52,
    lng: 13.405,
    genres: [
      "1. Hard Techno",
      "2. Dark Techno",
      "3. Dubstep",
      "4. Classical & Opera",
      "5. Flamenco (Spain)",
      "6. EDM (Modern Europe)",
    ],
  },
  {
    name: "West Africa (Nigeria / Ghana)",
    lat: 9.082,
    lng: 8.6753,
    genres: [
      "1. Afro (Afrobeats)",
      "2. Highlife",
      "3. Fuji Music",
      "4. Jùjú Music",
      "5. Afrobeat",
      "6. Palm-wine Music",
    ],
  },
  {
    name: "North America (USA / Canada)",
    lat: 37.0902,
    lng: -95.7129,
    genres: [
      "1. Old School Hip-Hop",
      "2. House (Chicago / Detroit)",
      "3. Blues (Memphis / Delta)",
      "4. Jazz (New Orleans)",
      "5. Country & Americana",
      "6. Rock & Roll",
    ],
  },
  {
    name: "South America (Brazil / Argentina)",
    lat: -14.235,
    lng: -51.9253,
    genres: [
      "1. Reggatone",
      "2. Samba",
      "3. Bossa Nova",
      "4. Tango",
      "5. Cumbia",
      "6. Baile Funk",
    ],
  },
  {
    name: "Caribbean (Jamaica)",
    lat: 18.1096,
    lng: -77.2975,
    genres: [
      "1. Reggae",
      "2. Dancehall",
      "3. Calypso",
      "4. Soca",
      "5. Dub",
      "6. Ska",
    ],
  },
  {
    name: "Oceania (Australia / New Zealand)",
    lat: -25.2744,
    lng: 133.7751,
    genres: [
      "1. Indigenous Australian Music",
      "2. Māori Music",
      "3. Contemporary Australian Rock/Pop",
      "4. Pacific Reggae",
      "5. Bush Ballads",
      "6. Didgeridoo Ambient",
    ],
  },
]

interface GlobeProps {
  className?: string
}

export function Globe({ className = "" }: GlobeProps) {
  const setSelectedRegion = useGenreStore((state) => state.setSelectedRegion)

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

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  // Single WebGL Instance Initialization & Responsive Scaling (NO re-destruction jumping)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    const canvas = canvasRef.current
    const container = containerRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function initGlobe() {
      const width = container.clientWidth || 480
      if (width === 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = width * dpr

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 18000,
        mapBrightness: 10,
        baseColor: [1, 1, 1],
        markerColor: [0, 0, 0],
        glowColor: [0.94, 0.93, 0.91],
        markerElevation: 0.03,
        markers: REGION_COORDINATE_MAP.map((r) => ({
          location: [r.lat, r.lng],
          size: selectedMarkerRef.current.name === r.name ? 0.06 : 0.035,
        })),
        opacity: 0.95,
      })

      function renderLoop() {
        if (!isPausedRef.current) {
          phi += 0.0006
          if (
            Math.abs(velocity.current.phi) > 0.0001 ||
            Math.abs(velocity.current.theta) > 0.0001
          ) {
            phiOffsetRef.current += velocity.current.phi
            thetaOffsetRef.current += velocity.current.theta
            velocity.current.phi *= 0.95
            velocity.current.theta *= 0.95
          }
          const thetaMin = -0.4,
            thetaMax = 0.4
          if (thetaOffsetRef.current < thetaMin) {
            thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
          } else if (thetaOffsetRef.current > thetaMax) {
            thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
          }
        }

        const totalPhi = phi + phiOffsetRef.current + dragOffset.current.phi
        const totalTheta = 0.2 + thetaOffsetRef.current + dragOffset.current.theta

        currentPhiRef.current = totalPhi
        currentThetaRef.current = totalTheta

        if (globe) {
          globe.update({
            phi: totalPhi,
            theta: totalTheta,
            markers: REGION_COORDINATE_MAP.map((r) => ({
              location: [r.lat, r.lng],
              size: selectedMarkerRef.current.name === r.name ? 0.06 : 0.035,
            })),
          })
        }
        animationId = requestAnimationFrame(renderLoop)
      }
      renderLoop()
      setTimeout(() => canvas && (canvas.style.opacity = "1"), 50)
    }

    // Responsive ResizeObserver for logical fluid scaling and tab-switch restoration
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          if (!globe) {
            initGlobe()
          } else {
            const newWidth = entry.contentRect.width
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            globe.update({
              width: newWidth * dpr,
              height: newWidth * dpr,
            })
          }
        }
      }
    })

    initGlobe()
    resizeObserver.observe(container)

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      if (globe) globe.destroy()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handleMouseMove}
        onPointerLeave={() => {
          setHoveredMarker(null)
          setTooltipPos(null)
        }}
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

      {/* Region Hover Tooltip Card */}
      {hoveredMarker && tooltipPos && (
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
      )}

      {/* Selected Active Marker Badge Overlay */}
      {selectedMarker && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-neutral-200 px-3 py-1 rounded-full text-[11px] font-medium text-black shadow-sm flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-black"></span>
          <span>{selectedMarker.name}</span>
        </div>
      )}
    </div>
  )
}
