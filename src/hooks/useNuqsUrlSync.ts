"use client";

import { useQueryState, parseAsString, parseAsStringEnum } from "nuqs";
import { useEffect, useRef } from "react";
import { useGenreStore } from "@/store/useGenreStore";
import { getGenresForRegion } from "@/data/music-genres";

export function useNuqsUrlSync() {
  const [tabParam, setTabParam] = useQueryState(
    "tab",
    parseAsStringEnum<"map" | "region">(["map", "region"]).withDefault("map")
  );
  const [genreParam, setGenreParam] = useQueryState("genre", parseAsString);
  const [continentParam, setContinentParam] = useQueryState("continent", parseAsString);
  const [qParam, setQParam] = useQueryState("q", parseAsString);

  const activeTab = useGenreStore((state) => state.activeTab);
  const setActiveTab = useGenreStore((state) => state.setActiveTab);
  const selectedGenre = useGenreStore((state) => state.selectedGenre);
  const selectedContinent = useGenreStore((state) => state.selectedContinent);
  const setSelectedRegion = useGenreStore((state) => state.setSelectedRegion);
  const regionFilter = useGenreStore((state) => state.regionFilter);
  const setRegionFilter = useGenreStore((state) => state.setRegionFilter);

  const isHydratedRef = useRef(false);

  // 1. Hydrate store from URL search params on initial load
  useEffect(() => {
    if (isHydratedRef.current) return;
    isHydratedRef.current = true;

    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }

    if (qParam) {
      setRegionFilter(qParam);
    }

    if (genreParam) {
      const genres = getGenresForRegion(genreParam);
      setSelectedRegion(genreParam, genres, continentParam || undefined);
    }
  }, []);

  // 2. Sync Zustand state changes back to URL search params via nuqs
  useEffect(() => {
    if (!isHydratedRef.current) return;

    if (activeTab !== tabParam) {
      setTabParam(activeTab === "map" ? null : activeTab);
    }

    if (selectedGenre !== genreParam) {
      setGenreParam(selectedGenre || null);
    }

    if (selectedContinent !== continentParam) {
      setContinentParam(selectedContinent || null);
    }

    if (regionFilter !== (qParam || "")) {
      setQParam(regionFilter || null);
    }
  }, [activeTab, selectedGenre, selectedContinent, regionFilter]);
}
