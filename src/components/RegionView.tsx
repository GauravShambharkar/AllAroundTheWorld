"use client"

import React from "react"
import { getMicrogenreCount } from "@/data/music-genres"
import { useRegionSelection } from "@/features/regions/hooks/useRegionSelection"
import { ContinentGroup } from "@/features/regions/components/ContinentGroup"
import { SubregionItem } from "@/features/regions/components/SubregionItem"

export function RegionView() {
  const {
    selectedGenre,
    expandedContinents,
    expandedSubItems,
    loadingCategory,
    filteredStructure,
    toggleExpand,
    toggleSubItemExpand,
    handleSelectCategory,
  } = useRegionSelection()

  return (
    <div className="w-full h-full flex flex-col select-none text-black">
      {/* Optimized Region & Subgenre Scroll Feed */}
      <div className="flex-1 overflow-y-auto pr-1 text-[12px] leading-5 tracking-[-0.24px] custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {filteredStructure.map((group) => {
            const isExpanded = expandedContinents[group.continent] ?? true
            const totalCount = getMicrogenreCount(group.continent)
            const visibleItems = isExpanded ? group.items : group.items.slice(0, 3)
            const isContinentSelected = selectedGenre === group.continent

            return (
              <ContinentGroup
                key={group.continent}
                continent={group.continent}
                totalCount={totalCount}
                isExpanded={isExpanded}
                isContinentSelected={isContinentSelected}
                hasMoreThan3={group.items.length > 3}
                onSelect={() => handleSelectCategory(group.continent, group.continent, group.continent)}
                onToggleExpand={() => toggleExpand(group.continent)}
              >
                {visibleItems.map((item, idx) => {
                  const count = getMicrogenreCount(item.categoryKey)
                  const isSelected =
                    selectedGenre === item.label || selectedGenre === item.categoryKey
                  const isSubExpanded = expandedSubItems[item.id] ?? false

                  return (
                    <SubregionItem
                      key={item.id}
                      item={item}
                      idx={idx}
                      count={count}
                      isSelected={isSelected}
                      isSubExpanded={isSubExpanded}
                      loadingCategory={loadingCategory}
                      getMicrogenreCount={getMicrogenreCount}
                      onSelectCategory={(key, label) => handleSelectCategory(key, label, group.continent)}
                      onToggleSubExpand={(e) => toggleSubItemExpand(item.id, e)}
                    />
                  )
                })}
              </ContinentGroup>
            )
          })}
        </div>
      </div>
    </div>
  )
}
