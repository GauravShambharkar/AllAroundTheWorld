import { create } from "zustand";
import {
  createNavigationSlice,
  NavigationSlice,
} from "./slices/navigationSlice";
import {
  createAudioSlice,
  AudioSlice,
  GenreTrackInfo,
} from "./slices/audioSlice";

export type { GenreTrackInfo };

export const DEFAULT_GENRES: string[] = [];

export type GenreStore = NavigationSlice & AudioSlice;

export const useGenreStore = create<GenreStore>()((...a) => ({
  ...createNavigationSlice(...a),
  ...createAudioSlice(...a),
}));
