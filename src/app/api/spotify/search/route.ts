import { NextRequest, NextResponse } from "next/server"
import { searchSpotifyTracks } from "@/lib/spotify"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") || "reggaeton"

  try {
    const tracks = await searchSpotifyTracks(q)
    return NextResponse.json({ tracks })
  } catch (error) {
    return NextResponse.json({ error: "Failed to search Spotify" }, { status: 500 })
  }
}
