import { NextResponse } from "next/server"

// Dynamic EveryNoise / Spotify 6,000+ Microgenre Live Dataset Cache
let cachedGenres: any[] = []
let lastFetchTime = 0

async function fetchFullWorldGenreDataset(): Promise<any[]> {
  if (cachedGenres.length > 0 && Date.now() - lastFetchTime < 86400000) {
    return cachedGenres
  }

  try {
    // 1. Try EveryNoise at Once dataset
    const enRes = await fetch("https://everynoise.com/everynoise1d.cgi", {
      headers: {
        "User-Agent": "AllAroundTheWorld/1.0.0",
      },
      next: { revalidate: 86400 },
    })

    if (enRes.ok) {
      const html = await enRes.text()
      // Extract genre names from EveryNoise <a> tags: <a href="...name=...">genre name</a>
      const regex = /name=([^"&>]+)/gi
      const matches = new Set<string>()
      let match
      while ((match = regex.exec(html)) !== null) {
        const raw = decodeURIComponent(match[1]).replace(/\+/g, " ").trim()
        if (raw && raw.length > 1 && !raw.includes("http")) {
          matches.add(raw.charAt(0).toUpperCase() + raw.slice(1))
        }
      }

      if (matches.size > 100) {
        cachedGenres = Array.from(matches).map((name, index) => ({
          id: `en-${index}`,
          name,
          comment: "EveryNoise Spotify Microgenre",
        }))
        lastFetchTime = Date.now()
        return cachedGenres
      }
    }
  } catch (err) {
    console.warn("EveryNoise live fetch error, falling back to MusicBrainz:", err)
  }

  // 2. Fallback: MusicBrainz API
  try {
    const offsets = [0, 500, 1000, 1500]
    const requests = offsets.map((offset) =>
      fetch(`https://musicbrainz.org/ws/2/genre/all?limit=500&offset=${offset}&fmt=json`, {
        headers: {
          "User-Agent": "AllAroundTheWorld/1.0.0",
          Accept: "application/json",
        },
        next: { revalidate: 86400 },
      }).then((res) => (res.ok ? res.json() : { genres: [] }))
    )

    const results = await Promise.all(requests)
    const allRaw = results.flatMap((r) => r.genres || [])
    
    const uniqueMap = new Map<string, any>()
    allRaw.forEach((g: any, index: number) => {
      if (g.name && !uniqueMap.has(g.name.toLowerCase())) {
        uniqueMap.set(g.name.toLowerCase(), {
          id: g.id || `genre-${index}`,
          name: g.name.charAt(0).toUpperCase() + g.name.slice(1),
          comment: g.comment || "",
        })
      }
    })

    cachedGenres = Array.from(uniqueMap.values())
    lastFetchTime = Date.now()
    return cachedGenres
  } catch (err) {
    console.error("Error fetching live dynamic genre dataset:", err)
  }

  return []
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get("region") || ""
  const query = searchParams.get("query") || ""
  const limit = parseInt(searchParams.get("limit") || "2000", 10)

  const fullList = await fetchFullWorldGenreDataset()
  let results: any[] = fullList

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (g) => g.name.toLowerCase().includes(q) || g.comment.toLowerCase().includes(q)
    )
  }

  if (region) {
    const r = region.toLowerCase()
    const keywords: Record<string, string[]> = {
      "east asia": ["japan", "japanese", "kore", "k-pop", "j-pop", "chin", "c-pop", "taiwan", "canto", "mando", "city pop", "enka"],
      "south asia": ["india", "indian", "bolly", "filmi", "bhangra", "qawwali", "raga", "pakistan", "tamil", "punjab", "desu", "carnatic"],
      "southeast asia": ["indones", "gamelan", "dangdut", "thai", "luk thung", "vietnam", "philippin", "pinoy", "malays"],
      "central asia": ["kazakh", "uzbek", "mongol", "throat singing", "shaman", "tuvan"],
      "west asia": ["arabic", "middle east", "dabke", "maqam", "mizrahi", "persian", "turkish", "anatolian", "sufi"],
      "west africa": ["afro", "nigeria", "ghana", "highlife", "fuji", "juju", "palm-wine", "yoruba", "hausa"],
      "southern africa": ["amapiano", "gqom", "kwaito", "mbube", "maskandi", "south africa", "zulu"],
      "north africa": ["rai", "gnawa", "chaabi", "mahraganat", "moroccan", "egyptian", "algerian"],
      "east africa": ["bongo flava", "taarab", "benga", "kenyan", "ethiopian", "ugandan", "eritrean"],
      "classical": ["classical", "baroque", "romantic", "orchestr", "opera", "choral", "concerto", "sonata", "chamber"],
      "caribbean": ["reggae", "dancehall", "calypso", "soca", "dub", "rocksteady", "ska", "jamaica", "caribbean", "bachata", "merengue", "compas"],
      "south america": ["samba", "bossa", "tango", "cumbia", "pagode", "mpb", "brazil", "argentin", "chile", "peru", "colombia", "forro"],
      "north america": ["blues", "jazz", "country", "hip-hop", "hip hop", "house", "bluegrass", "gospel", "motown", "soul", "funk"],
      "europe": ["techno", "edm", "flamenco", "fado", "celtic", "polka", "synthwave", "eurovision", "britpop", "chanson", "schlager", "krautrock"],
    }

    const matchedKeys = keywords[r] || [r]
    results = results.filter((g) => {
      const gName = g.name.toLowerCase()
      const gComment = g.comment.toLowerCase()
      return matchedKeys.some((k) => gName.includes(k) || gComment.includes(k))
    })
  }

  const sliced = results.slice(0, limit)

  return NextResponse.json({
    genres: sliced.map((g, i) => `${i + 1}. ${g.name}`),
    total: results.length,
    source: "EveryNoise / Spotify Live Microgenre Dataset (/api/genres)",
  })
}
