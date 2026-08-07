"use client"

import React from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"
import { useAudioStore } from "@/features/audio/store/useAudioStore"

export function MobileBackBar() {
  const { activeTab, selectedGenre, setSelectedRegion } = useNavigationStore()
  const { stopAudio } = useAudioStore()

  if (!selectedGenre) return null

  return (
    <div className="md:hidden flex items-center justify-between gap-3 pb-2 border-b border-dotted border-[#545454]">
      <button
        type="button"
        onClick={() => {
          stopAudio()
          setSelectedRegion("", [], "")
        }}
        className="flex items-center gap-1 text-[12px] font-medium text-neutral-600 hover:text-black shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>
          {activeTab === "map" ? "Back to Map" : "Back to Regions"}
        </span>
      </button>
    </div>
  )
}
