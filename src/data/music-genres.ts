import { ALL_MICROGENRES, Microgenre } from "./all-microgenres"

export { ALL_MICROGENRES }
export type { Microgenre }

export interface RegionMarker {
  id: string
  name: string
  location: [number, number]
  genres: string[]
}

function filterMicrogenres(categoryOrRegion: string): Microgenre[] {
  const target = categoryOrRegion.toLowerCase().trim()

  return ALL_MICROGENRES.filter((g) => {
    const reg = g.region.toLowerCase()
    const sub = g.subregion.toLowerCase()
    const cats = g.categories.map((c) => c.toLowerCase())
    const name = g.name.toLowerCase()

    // 1. Exact subregion match (e.g., "east asia", "south asia", "west africa")
    if (sub === target) return true

    // 2. Exact category match (e.g., "classical", "opera", "reggae", "jazz")
    if (cats.includes(target)) return true

    // 3. Exact region match (e.g., "africa", "asia", "europe", "caribbean")
    if (reg === target) return true

    // 4. Name contains target keyword
    if (name.includes(target)) return true

    // 5. Strict word boundary check (avoid "east asia" matching "asia")
    if (target.length > 4 && sub.includes(target)) return true

    return false
  })
}

export function getGenresForRegion(categoryOrRegion: string): string[] {
  const matches = filterMicrogenres(categoryOrRegion)
  return matches.map((g, i) => `${i + 1}. ${g.name}`)
}

export function getMicrogenreCount(categoryOrRegion: string): number {
  return filterMicrogenres(categoryOrRegion).length
}

export const REGION_MARKERS: RegionMarker[] = [
  {
    id: "south-asia",
    name: "South Asia",
    location: [20.5937, 78.9629],
    genres: getGenresForRegion("South Asia"),
  },
  {
    id: "east-asia",
    name: "East Asia",
    location: [36.2048, 138.2529],
    genres: getGenresForRegion("East Asia"),
  },
  {
    id: "west-africa",
    name: "West Africa",
    location: [9.082, 8.6753],
    genres: getGenresForRegion("West Africa"),
  },
  {
    id: "europe",
    name: "Europe",
    location: [52.52, 13.405],
    genres: getGenresForRegion("Europe"),
  },
  {
    id: "south-america",
    name: "South America",
    location: [-14.235, -51.9253],
    genres: getGenresForRegion("South America"),
  },
  {
    id: "north-america",
    name: "North America",
    location: [37.0902, -95.7129],
    genres: getGenresForRegion("North America"),
  },
  {
    id: "caribbean",
    name: "Caribbean",
    location: [18.1096, -77.2975],
    genres: getGenresForRegion("Caribbean"),
  },
  {
    id: "oceania",
    name: "Oceania",
    location: [-25.2744, 133.7751],
    genres: getGenresForRegion("Oceania"),
  },
]

export const DEFAULT_GENRES = ALL_MICROGENRES.map((g, i) => `${i + 1}. ${g.name}`)
