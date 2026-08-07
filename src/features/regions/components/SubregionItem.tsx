"use client"

import React from "react"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { SubregionItemData } from "@/features/regions/data/regionStructure"

interface SubregionItemProps {
  item: SubregionItemData
  idx: number
  count: number
  isSelected: boolean
  isSubExpanded: boolean
  loadingCategory: string | null
  getMicrogenreCount: (key: string) => number
  onSelectCategory: (key: string, label: string) => void
  onToggleSubExpand: (e: React.MouseEvent) => void
}

export function SubregionItem({
  item,
  idx,
  count,
  isSelected,
  isSubExpanded,
  loadingCategory,
  getMicrogenreCount,
  onSelectCategory,
  onToggleSubExpand,
}: SubregionItemProps) {
  return (
    <li className="flex flex-col">
      <div
        onClick={() => onSelectCategory(item.categoryKey, item.label)}
        className={`cursor-pointer transition-colors flex items-center justify-between py-1 px-1 rounded ${
          isSelected
            ? "font-bold text-black bg-neutral-100 underline decoration-2"
            : "hover:underline"
        }`}
      >
        <span className="flex items-center gap-1.5 truncate">
          <span>• {item.label}</span>
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-neutral-400 font-mono">
            {loadingCategory === item.label ? (
              <Loader2 className="w-3 h-3 animate-spin text-black" />
            ) : (
              `(${count})`
            )}
          </span>
          {item.subItems && (
            <button
              type="button"
              onClick={onToggleSubExpand}
              className="text-neutral-400 hover:text-black p-0.5"
              title="Toggle subregions"
            >
              {isSubExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Nested Dropdown Sub-Items */}
      {item.subItems && isSubExpanded && (
        <ul className="pl-4 space-y-1 mt-0.5 border-l border-neutral-200 ml-2">
          {item.subItems.map((sub, sIdx) => {
            const subCount = getMicrogenreCount(sub.categoryKey)
            const isSubSelected = loadingCategory === sub.label

            return (
              <li
                key={sub.id}
                onClick={() => onSelectCategory(sub.categoryKey, sub.label)}
                className={`cursor-pointer transition-colors flex items-center justify-between py-0.5 px-1 rounded text-[11px] ${
                  isSubSelected
                    ? "font-bold text-black bg-neutral-100 underline"
                    : "text-neutral-600 hover:text-black hover:underline"
                }`}
              >
                <span className="truncate">
                  {idx + 1}.{sIdx + 1} {sub.label}
                </span>
                <span className="text-[9px] text-neutral-400 font-mono shrink-0 ml-1">
                  {loadingCategory === sub.label ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-black" />
                  ) : (
                    `(${subCount})`
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
