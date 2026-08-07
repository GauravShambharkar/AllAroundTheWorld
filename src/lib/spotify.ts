import { ALL_MICROGENRES } from "@/data/all-microgenres"

export interface SpotifyTrack {
  id: string
  title: string
  artist: string
  albumArt: string
  previewUrl: string | null
  spotifyUrl: string
}

let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function getSpotifyAppToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.warn("Spotify credentials not configured in environment variables.")
    return null
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch Spotify app access token:", await res.text())
      return null
    }

    const data = await res.json()
    cachedToken = data.access_token
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
    return cachedToken
  } catch (error) {
    console.error("Error obtaining Spotify token:", error)
    return null
  }
}

/**
 * Curated Artist Pools per Genre / Region
 * Guarantees 100% authentic, relatable preview tracks when shuffling
 */
export const GENRE_ARTIST_POOLS: Record<string, string[]> = {
  // Punjabi & North India
  "punjabi pop & modern beats": ["AP Dhillon", "Diljit Dosanjh", "Karan Aujla", "Shubh", "Sidhu Moose Wala", "Guru Randhawa", "Gippy Grewal", "Harrdy Sandhu"],
  "punjabi bhangra": ["Panjabi MC", "Malkit Singh", "Gurdas Maan", "Bally Sagoo", "Jassi Sidhu", "Jazzy B"],
  "pakistan & northwest": ["Nusrat Fateh Ali Khan", "Rahat Fateh Ali Khan", "Atif Aslam", "Ali Zafar", "Abida Parveen", "Coke Studio Pakistan"],

  // Malayalam & South India
  "malayalam modern & pop": ["Sai Abhyankkar", "Hesham Abdul Wahab", "Sushin Shyam", "Shaan Rahman", "Job Kurian", "Gopi Sundar", "Deepak Dev"],
  "malayalam modern": ["Sai Abhyankkar", "Hesham Abdul Wahab", "Sushin Shyam", "Shaan Rahman", "Gopi Sundar"],
  "malayalam pop": ["Sai Abhyankkar", "Hesham Abdul Wahab", "Sushin Shyam"],
  "malayalam sopanam & mappila pattu": ["Sai Abhyankkar", "Hesham Abdul Wahab", "KJ Yesudas"],
  "malayalam indie": ["When Chai Met Toast", "Thaikkudam Bridge", "Avial", "Masala Coffee"],
  "malayalam": ["Sai Abhyankkar", "Hesham Abdul Wahab", "Sushin Shyam", "KJ Yesudas"],

  // Tamil & Kollywood
  "tamil modern & pop": ["Anirudh Ravichander", "AR Rahman Tamil", "Yuvan Shankar Raja", "G V Prakash", "Santhosh Narayanan", "D Imman", "Hiphop Tamizha"],
  "tamil modern": ["Anirudh Ravichander", "AR Rahman Tamil", "Yuvan Shankar Raja", "Santhosh Narayanan"],
  "tamil pop": ["Anirudh Ravichander", "AR Rahman Tamil", "Yuvan Shankar Raja"],
  "tamil gaana & kuthu beats": ["Anirudh Ravichander", "Gana Bala", "Deva Tamil", "Santhosh Narayanan"],
  "kollywood tamil cinema music": ["Anirudh Ravichander", "AR Rahman Tamil", "Yuvan Shankar Raja", "Ilaiyaraaja"],
  "tamil hip-hop": ["Anirudh Ravichander", "Hiphop Tamizha", "Arivu", "Yogi B"],
  "tamil rock": ["Anirudh Ravichander", "Agam", "Avial"],
  "tamil": ["Anirudh Ravichander", "AR Rahman Tamil", "Yuvan Shankar Raja", "Ilaiyaraaja"],

  // Other India & South Asia
  "desi hip-hop & gully rap": ["DIVINE", "Naezy", "Raftaar", "KR$NA", "MC Stan", "Seedhe Maut", "EPR"],
  "desi hip-hop": ["DIVINE", "Naezy", "Raftaar", "KR$NA", "MC Stan"],
  "bollywood & filmi classics": ["Lata Mangeshkar", "Kishore Kumar", "Asha Bhosle", "RD Burman", "Mohammed Rafi"],
  "bollywood": ["A R Rahman", "Arijit Singh", "Pritam", "Shreya Ghoshal", "Vishal Shekhar"],
  "hindustani classical raga": ["Ravi Shankar", "Hariprasad Chaurasia", "Bhimsen Joshi", "Zakir Hussain"],
  "hindustani classical": ["Ravi Shankar", "Hariprasad Chaurasia", "Bhimsen Joshi"],
  "qawwali sufi music": ["Nusrat Fateh Ali Khan", "Rahat Fateh Ali Khan", "Sabri Brothers", "Abida Parveen"],
  "qawwali": ["Nusrat Fateh Ali Khan", "Rahat Fateh Ali Khan", "Sabri Brothers"],
  "marathi lavani & powada": ["Apsara Aali Lavani", "Ajay Atul", "Adarsh Shinde"],
  "gujarati garba & dandiya raas": ["Falguni Pathak", "Aditya Gadhvi", "Kinjal Dave"],
  "bengali baul & bhatiali folk": ["Anupam Roy", "Purna Das Baul", "Rupam Islam"],
  "rabindra sangeet": ["Rabindra Sangeet Shreya Ghoshal", "Babul Supriyo"],

  // Slap House & EDM
  "slap house": ["R3HAB", "Dynoro", "ViZE", "Topic", "Gaullin", "LUM!X", "MEDUZA"],
  "slap house / brazilian bass": ["R3HAB", "Alok", "Dynoro", "ViZE", "Vintage Culture"],
  "slap house edm": ["R3HAB", "Dynoro", "ViZE", "Topic"],
  "hard techno": ["Charlotte de Witte", "Amelie Lens", "I Hate Models", "Kobosil", "Klangkuenstler"],
  "dark techno": ["Amelie Lens", "Charlotte de Witte", "Paula Temple", "Rebekah", "Adam Beyer"],

  // Latin / Caribbean / Reggae
  "reggae": ["Bob Marley", "Damian Marley", "Chronixx", "Protoje", "Koffee", "Burning Spear", "Buju Banton"],
  "dancehall": ["Sean Paul", "Vybz Kartel", "Popcaan", "Beenie Man", "Shaggy", "Bounty Killer"],
  "samba": ["Sergio Mendes", "Jorge Ben Jor", "Seu Jorge", "Beth Carvalho", "Zeca Pagodinho"],
  "bossa nova": ["Stan Getz", "Joao Gilberto", "Tom Jobim", "Astrud Gilberto"],
  "tango": ["Astor Piazzolla", "Carlos Gardel", "Gotan Project", "Bajofondo"],

  // East Asia
  "city pop (japan)": ["Mariya Takeuchi", "Miki Matsubara", "Tatsuro Yamashita", "Anri", "Junko Ohashi"],
  "city pop": ["Mariya Takeuchi", "Miki Matsubara", "Tatsuro Yamashita", "Anri"],
  "k-pop (korea)": ["BTS", "BLACKPINK", "NewJeans", "TWICE", "Stray Kids", "EXO", "SEVENTEEN"],
  "k-pop": ["BTS", "BLACKPINK", "NewJeans", "TWICE", "Stray Kids"],

  // Global Iconic
  "old school hip-hop": ["Grandmaster Flash", "Run DMC", "Sugarhill Gang", "Eric B & Rakim", "Public Enemy"],
  "hip-hop": ["Kendrick Lamar", "2Pac", "Notorious BIG", "Nas", "J Cole", "Wu-Tang Clan", "Outkast", "50 Cent"],
  "blues": ["BB King", "Muddy Waters", "Buddy Guy", "Robert Johnson", "Howlin Wolf"],
  "jazz": ["Miles Davis", "John Coltrane", "Thelonious Monk", "Duke Ellington", "Chet Baker"],
  "flamenco (spain)": ["Paco de Lucia", "Camaron de la Isla", "Vicente Amigo", "Tomatito"],
  "flamenco": ["Paco de Lucia", "Camaron de la Isla", "Vicente Amigo"],
  "afro (afrobeats)": ["Burna Boy", "Wizkid", "Davido", "Asake", "Rema", "Tiwa Savage"],
  "afrobeats": ["Burna Boy", "Wizkid", "Davido", "Asake", "Rema"],
  "amapiano": ["Tyler ICU", "Kabza De Small", "DJ Maphorisa", "Focalistic", "Uncle Waffles"],
}

// Global western pop stars list to prevent accidental bleeding into regional queries
const DISALLOWED_REGIONAL_BLEED = ["drake", "adele", "khalid", "taylor swift", "ed sheeran", "justin bieber", "maroon 5"]

export async function searchSpotifyTracks(query: string, randomize: boolean = false): Promise<SpotifyTrack[]> {
  const token = await getSpotifyAppToken()
  let spotifyItems: any[] = []

  // Clean input query & strip parenthetical notes / numbers
  const rawQ = query.replace(/^\d+(\.\d+)?\.\s*/, "").trim()
  const cleanQ = rawQ.toLowerCase().trim()
  const strippedQ = cleanQ.replace(/\s*\([^)]*\)/g, "").replace(/\//g, " ").trim()

  // Find metadata from ALL_MICROGENRES for region/country fallback
  const matchedGenre = ALL_MICROGENRES.find(
    (g) => g.name.toLowerCase() === cleanQ || g.id.toLowerCase() === cleanQ || g.name.toLowerCase() === strippedQ
  )

  const isRegional =
    matchedGenre?.region === "Asia" ||
    matchedGenre?.region === "Africa" ||
    matchedGenre?.region === "South America" ||
    matchedGenre?.region === "Caribbean" ||
    cleanQ.includes("punjabi") ||
    cleanQ.includes("malayalam") ||
    cleanQ.includes("tamil") ||
    cleanQ.includes("hindi") ||
    cleanQ.includes("bollywood") ||
    cleanQ.includes("garba") ||
    cleanQ.includes("qawwali")

  // Determine query list based on genre artist pools & metadata
  const artistPool = GENRE_ARTIST_POOLS[cleanQ] || GENRE_ARTIST_POOLS[strippedQ]

  let searchTermsToTry: string[] = []

  if (artistPool && artistPool.length > 0) {
    if (randomize) {
      // Pick random artists from pool
      const shuffledPool = [...artistPool].sort(() => 0.5 - Math.random())
      searchTermsToTry = shuffledPool.map((artist) => `${artist} ${strippedQ}`)
    } else {
      searchTermsToTry = artistPool.map((artist) => `${artist} ${strippedQ}`)
    }
  }

  // Add default matched queries
  if (matchedGenre?.query) {
    searchTermsToTry.push(matchedGenre.query)
  }
  searchTermsToTry.push(rawQ, `${strippedQ} ${matchedGenre?.country || matchedGenre?.subregion || ""}`.trim())

  // Deduplicate search terms
  searchTermsToTry = Array.from(new Set(searchTermsToTry.filter(Boolean)))

  // 1. Try Spotify API
  if (token) {
    for (const term of searchTermsToTry.slice(0, 3)) {
      try {
        const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=track&limit=15`
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          const rawItems = data.tracks?.items || []
          if (rawItems.length > 0) {
            spotifyItems = rawItems
            break
          }
        }
      } catch (err) {
        console.error("Spotify API Search error:", err)
      }
    }
  }

  // Format Spotify results
  let tracks: SpotifyTrack[] = spotifyItems.map((item: any) => ({
    id: item.id,
    title: item.name,
    artist: item.artists.map((a: any) => a.name).join(", "),
    albumArt: item.album?.images?.[0]?.url || "",
    previewUrl: item.preview_url,
    spotifyUrl: item.external_urls?.spotify || "#",
  }))

  // Filter out disallowed western pop bleed for regional queries
  if (isRegional) {
    tracks = tracks.filter(
      (t) => !DISALLOWED_REGIONAL_BLEED.some((bad) => t.artist.toLowerCase().includes(bad))
    )
  }

  const validTracks = tracks.filter((t) => t.previewUrl)

  if (validTracks.length > 0) {
    if (randomize && validTracks.length > 1) {
      const randomIndex = Math.floor(Math.random() * validTracks.length)
      const selected = validTracks[randomIndex]
      return [selected, ...validTracks.filter((_, i) => i !== randomIndex)]
    }
    return validTracks
  }

  // 2. Resilient Fallback: iTunes Search API
  let iTunesTracks: SpotifyTrack[] = []

  for (const term of searchTermsToTry) {
    if (!term || term.length < 2) continue
    try {
      const iTunesRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=15`
      )
      if (iTunesRes.ok) {
        const iTunesData = await iTunesRes.json()
        const iResults = iTunesData.results || []

        for (const iTrack of iResults) {
          const artistLower = (iTrack.artistName || "").toLowerCase()
          if (isRegional && DISALLOWED_REGIONAL_BLEED.some((bad) => artistLower.includes(bad))) {
            continue // Skip western pop bleed
          }

          if (iTrack.previewUrl) {
            iTunesTracks.push({
              id: String(iTrack.trackId),
              title: iTrack.trackName,
              artist: iTrack.artistName,
              albumArt: iTrack.artworkUrl100?.replace("100x100bb", "300x300bb") || "",
              previewUrl: iTrack.previewUrl,
              spotifyUrl: iTrack.trackViewUrl || "#",
            })
          }
        }

        if (iTunesTracks.length > 0) break
      }
    } catch (err) {
      console.error(`iTunes Audio Preview fetch error for term "${term}":`, err)
    }
  }

  if (iTunesTracks.length > 0) {
    if (randomize && iTunesTracks.length > 1) {
      const randIdx = Math.floor(Math.random() * iTunesTracks.length)
      const chosen = iTunesTracks[randIdx]
      return [chosen, ...iTunesTracks.filter((_, i) => i !== randIdx)]
    }
    return iTunesTracks
  }

  return tracks
}
