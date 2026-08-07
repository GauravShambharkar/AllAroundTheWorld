"use client"

import React from "react"
import { useNavigationStore } from "@/features/navigation/store/useNavigationStore"

interface TabSwitcherProps {
  className?: string
}

export function TabSwitcher({ className = "" }: TabSwitcherProps) {
  const { activeTab, setActiveTab } = useNavigationStore()

  return (
    <div className={`flex items-center gap-6 text-[16px] tracking-[-0.8px] ${className}`}>
      <button
        type="button"
        onClick={() => setActiveTab("map")}
        className={`transition-colors outline-none focus:outline-none ${
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
        className={`transition-colors outline-none focus:outline-none ${
          activeTab === "region"
            ? "text-black underline underline-offset-4 decoration-2 font-medium"
            : "text-[#545454] hover:text-black font-normal"
        }`}
      >
        Region
      </button>
    </div>
  )
}
