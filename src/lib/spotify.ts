// src/lib/spotify.ts - CORRECTED
// ❌ DELETE THIS ENTIRE SECTION:
// declare global {
//   interface ImportMetaEnv {
//     readonly SPOTIFY_CLIENT_ID?: string;
//     readonly SPOTIFY_CLIENT_SECRET?: string;
//     readonly SPOTIFY_REFRESH_TOKEN?: string;
//   }
//   interface ImportMeta {
//     readonly env: ImportMetaEnv;
//   }
// }

// ✅ Just keep the code:
const client_id = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID; // Use PUBLIC_ prefix
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

if (!client_id || !client_secret) {
  throw new Error("Missing Spotify credentials in environment variables");
}

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";

async function getAccessToken() {
  if (!refresh_token) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  return response.json();
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export async function getTopTracks() {
  const { access_token } = await getAccessToken();

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}
