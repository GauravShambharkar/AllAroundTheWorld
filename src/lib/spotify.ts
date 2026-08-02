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

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  const token = await getSpotifyAppToken()
  let spotifyItems: any[] = []

  if (token) {
    try {
      const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=8`
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        spotifyItems = data.tracks?.items || []
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

  // Find a track that already has a valid preview_url from Spotify
  const trackWithPreview = tracks.find((t) => t.previewUrl)
  if (trackWithPreview) {
    return tracks
  }

  // If Spotify preview_url is null for these tracks, query iTunes Search API to get the authentic 30s audio preview
  try {
    const iTunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5`
    )
    if (iTunesRes.ok) {
      const iTunesData = await iTunesRes.json()
      const iResults = iTunesData.results || []

      if (iResults.length > 0) {
        const iTrack = iResults[0]
        const authenticAudioUrl = iTrack.previewUrl

        if (tracks.length > 0) {
          // Attach authentic audio preview to the top Spotify track result
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
