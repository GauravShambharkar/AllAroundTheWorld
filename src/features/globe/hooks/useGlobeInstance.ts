"use client"

import { useEffect, MutableRefObject } from "react"
import createGlobe from "cobe"
import { REGION_COORDINATE_MAP, LocationSelection } from "@/features/globe/data/regionCoordinates"

interface UseGlobeInstanceParams {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
  containerRef: MutableRefObject<HTMLDivElement | null>
  isPausedRef: MutableRefObject<boolean>
  phiOffsetRef: MutableRefObject<number>
  thetaOffsetRef: MutableRefObject<number>
  dragOffset: MutableRefObject<{ phi: number; theta: number }>
  velocity: MutableRefObject<{ phi: number; theta: number }>
  currentPhiRef: MutableRefObject<number>
  currentThetaRef: MutableRefObject<number>
  selectedMarkerRef: MutableRefObject<LocationSelection>
  handlePointerMove: (e: PointerEvent) => void
  handlePointerUp: (e: PointerEvent) => void
}

export function useGlobeInstance({
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
}: UseGlobeInstanceParams) {
  // Global pointer event listeners for drag across entire window
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
}
