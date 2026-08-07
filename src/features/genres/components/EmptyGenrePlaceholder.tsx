"use client"

import React from "react"
import { Compass } from "lucide-react"

export function EmptyGenrePlaceholder() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#545454]">
      <Compass className="w-8 h-8 mb-4 stroke-1 text-neutral-400 animate-pulse" />
      <h3 className="text-[14px] font-medium text-black mb-1">
        Select a Region or Search
      </h3>
      <p className="text-[12px] leading-5 max-w-[256px]">
        Explore genres by picking a location on the left or typing in the
        search bar above.
      </p>
    </div>
  )
}
