// src/lib/spotify/api.ts
export async function fetchCurrentPlayback(token: string) {
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch current playback");
  return response.json();
}

export async function fetchRecentlyPlayed(token: string) {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) throw new Error("Failed to fetch recently played");
  return response.json();
}

export async function fetchPlaylistTracks(token: string, playlistId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();
  return data.items.map((item: any) => item.track).filter((t: any) => t?.id);
}

export async function fetchAlbumTracks(token: string, albumId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();

  const tracks = data.items.filter((t: any) => t?.id);
  const fullTracks = await Promise.all(
    tracks.map(async (track: any) => {
      const trackResponse = await fetch(
        `https://api.spotify.com/v1/tracks/${track.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return await trackResponse.json();
    })
  );

  return fullTracks;
}

export async function playTrack(token: string, uri: string) {
  return fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: [uri] }),
  });
}

export async function setShuffle(token: string, state: boolean) {
  return fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function transferPlayback(token: string, deviceId: string) {
  return fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ device_ids: [deviceId], play: true }),
  });
}
