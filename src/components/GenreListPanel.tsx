"use client";

import React, { useState } from "react";
import { useGenreStore } from "@/store/useGenreStore";
import {
  Play,
  Pause,
  Volume2,
  Loader2,
  Music,
  ExternalLink,
  Search,
  Compass,
  ArrowLeft,
} from "lucide-react";

export function GenreListPanel() {
  const genreList = useGenreStore((state) => state.activeGenreList);
  const selectedRegionName = useGenreStore((state) => state.selectedRegionName);
  const selectedGenre = useGenreStore((state) => state.selectedGenre);
  const selectedContinent = useGenreStore((state) => state.selectedContinent);
  const playingGenre = useGenreStore((state) => state.playingGenre);
  const currentTrack = useGenreStore((state) => state.currentTrack);
  const isPlaying = useGenreStore((state) => state.isPlaying);
  const isLoadingAudio = useGenreStore((state) => state.isLoadingAudio);
  const playGenreTrack = useGenreStore((state) => state.playGenreTrack);
  const togglePlayPause = useGenreStore((state) => state.togglePlayPause);
  const stopAudio = useGenreStore((state) => state.stopAudio);
  const setSelectedRegion = useGenreStore((state) => state.setSelectedRegion);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // Live dynamic search against server API (/api/genres)
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (!q.trim()) return;

    setIsSearchingApi(true);
    try {
      const res = await fetch(
        `/api/genres?query=${encodeURIComponent(q)}&limit=100`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.genres && data.genres.length > 0) {
          setSelectedRegion(
            `Search: "${q}" (${data.total} results)`,
            data.genres,
          );
        }
      }
    } catch (err) {
      console.error("Live API search error:", err);
    } finally {
      setIsSearchingApi(false);
    }
  };

  const handleFetchThousands = async () => {
    setIsSearchingApi(true);
    try {
      const res = await fetch("/api/genres?limit=300");
      if (res.ok) {
        const data = await res.json();
        setSelectedRegion(
          `Live Server API (${data.total} genres)`,
          data.genres,
        );
      }
    } catch (err) {
      console.error("Fetch all genres error:", err);
    } finally {
      setIsSearchingApi(false);
    }
  };

  const [visibleLimit, setVisibleLimit] = useState(80);

  React.useEffect(() => {
    setVisibleLimit(80);
  }, [genreList]);

  const visibleGenres = genreList.slice(0, visibleLimit);
  const hasMore = visibleLimit < genreList.length;

  return (
    <div className="w-full h-full flex flex-col gap-4 select-none">
      {/* Mobile Top Control Row */}
      {selectedGenre && (
        <div className="md:hidden flex items-center justify-between gap-3 pb-2 border-b border-dotted border-[#545454]">
          <button
            type="button"
            onClick={() => {
              stopAudio();
              setSelectedRegion("", [], "");
            }}
            className="flex items-center gap-1 text-[12px] font-medium text-neutral-600 hover:text-black shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Regions</span>
          </button>

          {/* Search Bar on Mobile */}
          <div className="relative w-full max-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search genres..."
              className="w-full pl-7 pr-2 py-1 text-[11px] outline-none bg-transparent border-b border-neutral-200 focus:border-black transition-colors"
            />
          </div>
        </div>
      )}

      {/* Desktop Search Bar — right-aligned */}
      <div className="hidden md:flex justify-end">
        <div className="relative w-full max-w-[256px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search genres..."
            className="w-full pl-8 pr-4 py-2 text-[12px] outline-none bg-transparent border-b border-neutral-200 focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Active Audio Playing Banner (Every Noise at Once Style Instant Player) */}
      {playingGenre && (
        <div className="w-full bg-[#f9f9f9] border border-black p-3 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 overflow-hidden">
            {currentTrack?.albumArt ? (
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.title}
                className="w-10 h-10 rounded object-cover border border-neutral-300 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center shrink-0">
                <Music className="w-5 h-5" />
              </div>
            )}

            <div className="flex flex-col truncate">
              <div className="flex items-center gap-2 text-[12px] font-bold text-black uppercase tracking-tight">
                <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                <span className="truncate">{playingGenre}</span>
              </div>
              <div className="text-[12px] text-neutral-600 truncate">
                {currentTrack
                  ? `${currentTrack.title} — ${currentTrack.artist}`
                  : "Loading track..."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLoadingAudio ? (
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : (
              <button
                type="button"
                onClick={togglePlayPause}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-transform active:scale-95"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-1" />
                )}
              </button>
            )}

            {currentTrack?.spotifyUrl && currentTrack.spotifyUrl !== "#" && (
              <a
                href={currentTrack.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-black p-1"
                title="Open on Spotify"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Genre List Feed or Empty Placeholder */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {genreList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#545454]">
            <Compass className="w-8 h-8 mb-4 stroke-1 text-neutral-400 animate-pulse" />
            <h3 className="text-[14px] font-medium text-black mb-1">
              Select a Region or Search
            </h3>
            <p className="text-[12px] leading-5 max-w-[256px]">
              Explore genres by picking a location on the left or typing in the search bar above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <ul className="space-y-1 text-[12px] leading-5 tracking-[-0.24px] text-[#545454]">
              {visibleGenres.map((item, index) => {
                const cleanName = item.replace(/^\d+\.\s*/, "").trim();
                const isCurrentPlaying = playingGenre === cleanName;

                return (
                  <li
                    key={index}
                    onClick={() => playGenreTrack(item)}
                    className={`py-2 px-2 rounded cursor-pointer border-b border-neutral-100 last:border-0 transition-colors flex items-center justify-between ${
                      isCurrentPlaying
                        ? "bg-black text-white font-medium shadow-sm"
                        : "hover:bg-neutral-100 text-[#545454] hover:text-black"
                    }`}
                  >
                    <span className="truncate">{item}</span>

                    {isCurrentPlaying && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold shrink-0 ml-2">
                        {isPlaying ? "▶ PLAYING" : "PAUSED"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {hasMore && (
              <div className="py-3 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleLimit((prev) => prev + 100)}
                  className="text-[11px] font-mono font-medium px-4 py-1.5 border border-neutral-300 rounded hover:bg-black hover:text-white transition-colors"
                >
                  + Load {genreList.length - visibleLimit} more genres
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
