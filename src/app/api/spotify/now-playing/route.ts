const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

// Spotify access tokens are valid for ~3600s. Cache it in module scope (per
// warm serverless instance) so repeated polls within that window reuse the
// same token instead of exchanging the refresh token on every single request.
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN ?? "",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to refresh Spotify access token");
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Refresh 60s early to stay safely ahead of actual expiry.
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.accessToken;
}

type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string | null;
  songUrl: string;
};

function mapTrack(item: any, isPlaying: boolean): Track {
  return {
    isPlaying,
    title: item?.name ?? "",
    artist: (item?.artists ?? []).map((a: any) => a.name).join(", "),
    album: item?.album?.name ?? "",
    albumImageUrl: item?.album?.images?.[0]?.url ?? null,
    songUrl: item?.external_urls?.spotify ?? "",
  };
}

export async function GET() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return Response.json({ isPlaying: false, configured: false });
  }

  try {
    const accessToken = await getAccessToken();

    const nowPlaying = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    // 200 with a track currently playing.
    if (nowPlaying.status === 200) {
      const data = await nowPlaying.json();
      if (data?.item) {
        return Response.json(mapTrack(data.item, Boolean(data.is_playing)));
      }
    }

    // 204 (nothing playing) or an ad/private session — fall back to the
    // most recently played track so the widget is never empty.
    const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (recent.status === 200) {
      const data = await recent.json();
      const item = data?.items?.[0]?.track;
      if (item) {
        return Response.json(mapTrack(item, false));
      }
    }

    return Response.json({ isPlaying: false });
  } catch {
    return Response.json({ isPlaying: false }, { status: 200 });
  }
}
