import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || ""

  try {
    const url = "https://musicbrainz.org/ws/2/genre/all?limit=100&fmt=json"
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AllAroundTheWorld/1.0.0 ( https://localhost:3000 )",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ genres: [] }, { status: res.status })
    }

    const data = await res.json()
    let genres = (data.genres || []).map((g: any) => ({
      id: g.id,
      name: g.name.charAt(0).toUpperCase() + g.name.slice(1),
      comment: g.comment || "",
    }))

    if (query) {
      const q = query.toLowerCase()
      genres = genres.filter(
        (g: any) => g.name.toLowerCase().includes(q) || g.comment.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ genres, total: genres.length })
  } catch (err) {
    console.error("MusicBrainz API error:", err)
    return NextResponse.json({ genres: [], total: 0 }, { status: 500 })
  }
}
