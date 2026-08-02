export interface MusicBrainzGenre {
  id: string
  name: string
  comment?: string
}

export async function fetchMusicBrainzGenres(query?: string): Promise<MusicBrainzGenre[]> {
  try {
    const url = query
      ? `/api/musicbrainz/genres?query=${encodeURIComponent(query)}`
      : `/api/musicbrainz/genres`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return data.genres || []
  } catch (err) {
    console.error("Failed to fetch MusicBrainz genres:", err)
    return []
  }
}
