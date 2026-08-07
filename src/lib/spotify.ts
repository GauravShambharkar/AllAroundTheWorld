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

const GENRE_SIGNATURE_EXEMPLARS: Record<string, string> = {
  // Malayalam Modern -> Sai Abhyankkar
  "malayalam modern & pop": "Sai Abhyankkar Katchi Sera",
  "malayalam modern": "Sai Abhyankkar Katchi Sera",
  "malayalam pop": "Sai Abhyankkar Katchi Sera",
  "malayalam sopanam & mappila pattu": "Sai Abhyankkar Aasa Kooda",
  "malayalam indie": "Sai Abhyankkar Katchi Sera",
  "malayalam": "Sai Abhyankkar Katchi Sera",

  // Tamil Modern -> Anirudh Ravichander
  "tamil modern & pop": "Anirudh Ravichander Hukum Naa Ready",
  "tamil modern": "Anirudh Ravichander Hukum Naa Ready",
  "tamil pop": "Anirudh Ravichander Hukum",
  "tamil gaana & kuthu beats": "Anirudh Ravichander Hukum Kuthu",
  "kollywood tamil cinema music": "Anirudh Ravichander Hukum Naa Ready",
  "tamil hip-hop": "Anirudh Ravichander Hiphop Tamizha",
  "tamil rock": "Anirudh Ravichander Hukum",
  "tamil": "Anirudh Ravichander Hukum",

  // South Asia & India Signature Exemplars
  "hindustani classical raga": "Ravi Shankar Raga Pandit",
  "hindustani classical": "Ravi Shankar Raga",
  "carnatic vocal & veena": "MS Subbulakshmi Carnatic",
  "carnatic": "MS Subbulakshmi Carnatic",
  "qawwali sufi music": "Nusrat Fateh Ali Khan Rashk E Qamar",
  "qawwali": "Nusrat Fateh Ali Khan",
  "punjabi bhangra": "Panjabi MC Mundian To Bach Ke",
  "bhangra": "Panjabi MC Mundian To Bach Ke",
  "bollywood & filmi classics": "Lata Mangeshkar Kishore Kumar Golden Hits",
  "bollywood": "A R Rahman Bollywood Classics",
  "marathi lavani & powada": "Apsara Aali Lavani Natarang",
  "marathi lavani": "Apsara Aali Lavani",
  "gujarati garba & dandiya raas": "Falguni Pathak Chogada Garba",
  "garba": "Falguni Pathak Garba",
  "bengali baul & bhatiali folk": "Baul Song Bengal Anupam Roy",
  "rabindra sangeet": "Rabindra Sangeet Shreya Ghoshal",
  "desi hip-hop & gully rap": "DIVINE Gully Boy Mere Gully Mein",
  "desi hip-hop": "DIVINE Gully Boy",
  "telugu folk & tollywood melodies": "Ramuloo Ramulaa Tollywood",
  "punjabi pop & modern beats": "AP Dhillon Diljit Dosanjh Punjabi Pop",

  // Iconic World Genre Signature Exemplars
  "slap house": "R3HAB All Around The World La La La",
  "slap house / brazilian bass": "R3HAB All Around The World La La La",
  "slap house edm": "R3HAB Lullaby",
  "reggae": "Bob Marley One Love",
  "dancehall": "Sean Paul Get Busy",
  "samba": "Mas Que Nada Sergio Mendes Samba",
  "bossa nova": "The Girl From Ipanema Stan Getz",
  "tango": "Astor Piazzolla Libertango",
  "city pop (japan)": "Mariya Takeuchi Plastic Love",
  "city pop": "Mariya Takeuchi Plastic Love",
  "k-pop (korea)": "BTS Dynamite K-Pop",
  "k-pop": "BTS Dynamite",
  "hard techno": "Charlotte de Witte Techno",
  "dark techno": "Amelie Lens Techno",
  "flamenco (spain)": "Paco de Lucia Entre Dos Aguas",
  "flamenco": "Paco de Lucia Entre Dos Aguas",
  "afro (afrobeats)": "Burna Boy Last Last",
  "afrobeats": "Burna Boy Last Last",
  "amapiano": "Tyler ICU Mnike Amapiano",
  "old school hip-hop": "Grandmaster Flash The Message Hip Hop",
  "blues": "BB King The Thrill Is Gone",
  "jazz": "Miles Davis So What Jazz",
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  const token = await getSpotifyAppToken()
  let spotifyItems: any[] = []

  // 1. Clean query & strip parenthetical notes / numbers
  const rawQ = query.replace(/^\d+(\.\d+)?\.\s*/, "").trim()
  const cleanQ = rawQ.toLowerCase().trim()
  const strippedQ = cleanQ.replace(/\s*\([^)]*\)/g, "").replace(/\//g, " ").trim()

  // 2. Signature Exemplar Resolution
  const searchQuery =
    GENRE_SIGNATURE_EXEMPLARS[cleanQ] ||
    GENRE_SIGNATURE_EXEMPLARS[strippedQ] ||
    rawQ

  if (token) {
    try {
      const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=15`
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        const rawItems = data.tracks?.items || []
        // Sort tracks by popularity score descending
        spotifyItems = rawItems.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
      }
    } catch (err) {
      console.error("Spotify API Search error:", err)
    }
  }

  // Format Spotify results
  const tracks: SpotifyTrack[] = spotifyItems.map((item: any) => ({
    id: item.id,
    title: item.name,
    artist: item.artists.map((a: any) => a.name).join(", "),
    albumArt: item.album?.images?.[0]?.url || "",
    previewUrl: item.preview_url,
    spotifyUrl: item.external_urls?.spotify || "#",
  }))

  // Check if Spotify returned a track with valid previewUrl
  const trackWithPreview = tracks.find((t) => t.previewUrl)
  if (trackWithPreview) {
    const bestIndex = tracks.indexOf(trackWithPreview)
    if (bestIndex > 0) {
      tracks.splice(bestIndex, 1)
      tracks.unshift(trackWithPreview)
    }
    return tracks
  }

  // 3. Resilient Fallback: Query iTunes Search API for 256kbps audio preview
  const searchTermsToTry = [searchQuery, strippedQ, `${strippedQ} music`]
  if (cleanQ.includes("malayalam")) {
    searchTermsToTry.push("Sai Abhyankkar Katchi Sera", "Sai Abhyankkar Aasa Kooda", "Sai Abhyankkar")
  }
  if (cleanQ.includes("tamil")) {
    searchTermsToTry.push("Anirudh Ravichander Hukum", "Anirudh Ravichander Naa Ready", "Anirudh Ravichander")
  }
  if (cleanQ.includes("slap house")) {
    searchTermsToTry.push("R3HAB All Around The World", "R3HAB Lullaby", "R3HAB Rock My Body", "R3HAB")
  }

  for (const term of searchTermsToTry) {
    if (!term || term.length < 2) continue
    try {
      const iTunesRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=5`
      )
      if (iTunesRes.ok) {
        const iTunesData = await iTunesRes.json()
        const iResults = iTunesData.results || []

        if (iResults.length > 0) {
          const iTrack = iResults[0]
          const authenticAudioUrl = iTrack.previewUrl

          if (authenticAudioUrl) {
            if (tracks.length > 0) {
              tracks[0].previewUrl = authenticAudioUrl
            } else {
              tracks.push({
                id: String(iTrack.trackId),
                title: iTrack.trackName,
                artist: iTrack.artistName,
                albumArt: iTrack.artworkUrl100?.replace("100x100bb", "300x300bb") || "",
                previewUrl: authenticAudioUrl,
                spotifyUrl: iTrack.trackViewUrl || "#",
              })
            }
            return tracks
          }
        }
      }
    } catch (err) {
      console.error(`iTunes Audio Preview fetch error for term "${term}":`, err)
    }
  }

  return tracks
}
