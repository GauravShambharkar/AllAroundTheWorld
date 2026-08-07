"use client"

import React from "react"

export function BrandBadge() {
  return (
    <div className="p-1.5 pl-2 pr-0 bg-black w-fit border shrink-0">
      <div className="bg-black text-white flex items-center justify-between gap-4 font-semibold text-[12px] leading-tight tracking-[-0.6px] shadow-sm min-w-[72px] h-[48px]">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span>All</span>
            <div className="w-full h-[10px] bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <span>Around</span>
            <div className="w-[12px] h-[10px] bg-white" />
          </div>
          <span>The World</span>
        </div>
      </div>
    </div>
  )
}
