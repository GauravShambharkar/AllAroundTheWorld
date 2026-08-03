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
  "tamil gaana & kuthu beats": "Rowdy Baby Dhanush Kuthu",
  "kollywood tamil cinema music": "AR Rahman Tamil Classics",
  "telugu folk & tollywood melodies": "Ramuloo Ramulaa Tollywood",
  "malayalam sopanam & mappila pattu": "Jivamshamayi Malayalam",
  "punjabi pop & modern beats": "AP Dhillon Diljit Dosanjh Punjabi Pop",

  // Iconic World Genre Signature Exemplars
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

  // Check if there is a signature exemplar search term for this query
  const cleanQ = query.toLowerCase().trim()
  const searchQuery = GENRE_SIGNATURE_EXEMPLARS[cleanQ] || query

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
        // Sort tracks by popularity score descending to get top-quality iconic recordings
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

  // Find the highest-popularity track that has a valid preview_url from Spotify
  const trackWithPreview = tracks.find((t) => t.previewUrl)
  if (trackWithPreview) {
    // Put the best track with preview first
    const bestIndex = tracks.indexOf(trackWithPreview)
    if (bestIndex > 0) {
      tracks.splice(bestIndex, 1)
      tracks.unshift(trackWithPreview)
    }
    return tracks
  }

  // Fallback: Query Apple Music / iTunes Search API for high-bitrate 256kbps audio preview of the top track
  try {
    const iTunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=5`
    )
    if (iTunesRes.ok) {
      const iTunesData = await iTunesRes.json()
      const iResults = iTunesData.results || []

      if (iResults.length > 0) {
        // Pick the top result from iTunes
        const iTrack = iResults[0]
        const authenticAudioUrl = iTrack.previewUrl

        if (tracks.length > 0) {
          // Attach high-fidelity audio preview to the top popular Spotify track result
          tracks[0].previewUrl = authenticAudioUrl
        } else {
          // Return iTunes result if Spotify returned no tracks
          tracks.push({
            id: String(iTrack.trackId),
            title: iTrack.trackName,
            artist: iTrack.artistName,
            albumArt: iTrack.artworkUrl100?.replace("100x100bb", "300x300bb") || "",
            previewUrl: authenticAudioUrl,
            spotifyUrl: iTrack.trackViewUrl || "#",
          })
        }
      }
    }
  } catch (err) {
    console.error("iTunes Audio Preview fetch error:", err)
  }

  return tracks
}
