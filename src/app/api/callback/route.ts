import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/?spotify_error=${encodeURIComponent(error)}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?spotify_error=no_code", request.url))
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/callback"

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Spotify token exchange failed:", errText)
      return NextResponse.redirect(new URL("/?spotify_error=token_exchange_failed", request.url))
    }

    const data = await res.json()
    const accessToken = data.access_token

    // Redirect to home page with access_token parameter for Spotify Web Playback SDK
    const response = NextResponse.redirect(new URL(`/?spotify_token=${accessToken}`, request.url))
    response.cookies.set("spotify_access_token", accessToken, {
      path: "/",
      httpOnly: false,
      maxAge: data.expires_in || 3600,
    })

    return response
  } catch (err) {
    console.error("Error handling Spotify callback:", err)
    return NextResponse.redirect(new URL("/?spotify_error=server_error", request.url))
  }
}
