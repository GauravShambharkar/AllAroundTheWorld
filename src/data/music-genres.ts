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
  // Clean target (e.g., "South Asia (India / Pak / BD)" -> "south asia")
  const rawTarget = categoryOrRegion.toLowerCase().trim()
  const cleanTarget = rawTarget.replace(/\s*\([^)]*\)/g, "").trim()

  return ALL_MICROGENRES.filter((g) => {
    const reg = g.region.toLowerCase()
    const sub = g.subregion.toLowerCase()
    const cats = g.categories.map((c) => c.toLowerCase())
    const name = g.name.toLowerCase()
    const country = (g.country || "").toLowerCase()

    // 1. Match subregion (e.g., "south asia", "west africa", "east asia")
    if (sub === cleanTarget || sub === rawTarget) return true

    // 2. Match categories array (e.g., "classical", "south asia", "reggae")
    if (cats.includes(cleanTarget) || cats.includes(rawTarget)) return true

    // 3. Match continent region (e.g., "asia", "africa", "europe")
    if (reg === cleanTarget || reg === rawTarget) return true

    // 4. Keyword in subregion or category (e.g., "hindustani & carnatic" contains "classical")
    if (cleanTarget.includes("classical") && (cats.includes("classical") || name.includes("classical") || name.includes("raga") || name.includes("carnatic"))) {
      return true
    }

    // 5. Country or Name match
    if (name.includes(cleanTarget) || country.includes(cleanTarget)) return true

    // 6. Substring match for longer targets
    if (cleanTarget.length > 3 && (sub.includes(cleanTarget) || reg.includes(cleanTarget))) return true

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
