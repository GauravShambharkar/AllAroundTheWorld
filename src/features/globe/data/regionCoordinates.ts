import { getGenresForRegion } from "@/data/music-genres"

export interface LocationSelection {
  name: string
  lat: number
  lng: number
  genres: string[]
}

export const REGION_COORDINATE_MAP: LocationSelection[] = [
  {
    name: "South Asia (India)",
    lat: 20.5937,
    lng: 78.9629,
    genres: getGenresForRegion("South Asia"),
  },
  {
    name: "East Asia (Japan / Korea)",
    lat: 36.2048,
    lng: 138.2529,
    genres: [
      "1. City Pop (Japan)",
      "2. K-Pop (Korea)",
      "3. Enka",
      "4. Gagaku Classical",
      "5. J-Rock",
      "6. Asian Lo-Fi Beats",
    ],
  },
  {
    name: "Southeast Asia (Indonesia / Thailand)",
    lat: 13.7563,
    lng: 100.5018,
    genres: [
      "1. Gamelan",
      "2. Luk Thung",
      "3. Dangdut",
      "4. Pinpeat",
      "5. Kroncong",
      "6. Thai Folk",
    ],
  },
  {
    name: "West Asia (Middle East)",
    lat: 29.3117,
    lng: 47.4818,
    genres: [
      "1. Maqam Classical",
      "2. Dabke",
      "3. Sufi Music",
      "4. Mizrahi",
      "5. Persian Dastgah",
      "6. Anatolian Rock",
    ],
  },
  {
    name: "Europe (Berlin / London / Paris)",
    lat: 52.52,
    lng: 13.405,
    genres: [
      "1. Hard Techno",
      "2. Dark Techno",
      "3. Dubstep",
      "4. Classical & Opera",
      "5. Flamenco (Spain)",
      "6. EDM (Modern Europe)",
    ],
  },
  {
    name: "West Africa (Nigeria / Ghana)",
    lat: 9.082,
    lng: 8.6753,
    genres: [
      "1. Afro (Afrobeats)",
      "2. Highlife",
      "3. Fuji Music",
      "4. Jùjú Music",
      "5. Afrobeat",
      "6. Palm-wine Music",
    ],
  },
  {
    name: "North America (USA / Canada)",
    lat: 37.0902,
    lng: -95.7129,
    genres: [
      "1. Old School Hip-Hop",
      "2. House (Chicago / Detroit)",
      "3. Blues (Memphis / Delta)",
      "4. Jazz (New Orleans)",
      "5. Country & Americana",
      "6. Rock & Roll",
    ],
  },
  {
    name: "South America (Brazil / Argentina)",
    lat: -14.235,
    lng: -51.9253,
    genres: [
      "1. Reggatone",
      "2. Samba",
      "3. Bossa Nova",
      "4. Tango",
      "5. Cumbia",
      "6. Baile Funk",
    ],
  },
  {
    name: "Caribbean (Jamaica)",
    lat: 18.1096,
    lng: -77.2975,
    genres: [
      "1. Reggae",
      "2. Dancehall",
      "3. Calypso",
      "4. Soca",
      "5. Dub",
      "6. Ska",
    ],
  },
  {
    name: "Oceania (Australia / New Zealand)",
    lat: -25.2744,
    lng: 133.7751,
    genres: [
      "1. Indigenous Australian Music",
      "2. Māori Music",
      "3. Contemporary Australian Rock/Pop",
      "4. Pacific Reggae",
      "5. Bush Ballads",
      "6. Didgeridoo Ambient",
    ],
  },
]
