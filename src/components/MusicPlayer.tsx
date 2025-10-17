// src/components/MusicPlayer.tsx - WITH DYNAMIC TAB TITLE
import { useState, useEffect } from "react";
import AlbumCarousel from "./AlbumCarousel";
import SongInfo from "./SongInfo";
import ProgressBar from "./ProgressBar";
import PlayerControls from "./PlayerControls";
import ConnectionStatus from "./ConnectionStatus";
import MeshGradientBackground from "./MeshGradientBackground";
import FullscreenButton from "./FullscreenButton";
import LibraryDropdown from "./LibraryDropdown";

interface MusicPlayerProps {
  token?: string;
}

export default function MusicPlayer({ token }: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [isLiked, setIsLiked] = useState(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [previousTracks, setPreviousTracks] = useState<any[]>([]);
  const [nextTracks, setNextTracks] = useState<any[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentContextUri, setCurrentContextUri] = useState<string>("");
  const [volume, setVolume] = useState(20);
  const [isShuffle, setIsShuffle] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(0);

  // Update browser tab title dynamically
  useEffect(() => {
    if (currentTrack && !isPaused) {
      const trackName = currentTrack.name;
      const artistName = currentTrack.artists?.[0]?.name || "Unknown Artist";
      document.title = ` ${trackName} - ${artistName}`;
    } else if (currentTrack && isPaused) {
      const trackName = currentTrack.name;
      const artistName = currentTrack.artists?.[0]?.name || "Unknown Artist";
      document.title = ` ${trackName} - ${artistName} `;
    } else {
      document.title = "Vyl - Music Player";
    }
  }, [currentTrack, isPaused]);

  // In the progress bar area, detect when crossfade should start
  const isCrossfading =
    crossfadeDuration > 0 && duration - currentTime <= crossfadeDuration;

  const handlePlaylistSelect = (playlistId: string, playlistName: string) => {
    console.log("Selected playlist:", playlistName, playlistId);
  };

  const handleShuffleToggle = async () => {
    if (!token) {
      console.error("No token available");
      return;
    }

    const newShuffleState = !isShuffle;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        setIsShuffle(newShuffleState);
        console.log("Shuffle is now:", newShuffleState ? "ON ✅" : "OFF ❌");
      } else {
        console.error("Failed to toggle shuffle:", response.status);
      }
    } catch (error) {
      console.error("Shuffle toggle error:", error);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (player) {
      player
        .setVolume(newVolume / 100)
        .catch((error) => console.error("Volume error:", error));
    }
  };

  // Poll for context changes and update tracks
  useEffect(() => {
    if (!token || !isActive) return;

    const pollContextChanges = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();
        const contextUri = data?.context?.uri || "";

        if (contextUri && contextUri !== currentContextUri) {
          console.log("Context changed to:", contextUri);
          setCurrentContextUri(contextUri);

          if (contextUri.includes("playlist")) {
            const playlistId = contextUri.split(":")[2];
            await fetchPlaylistTracks(playlistId);
          } else if (contextUri.includes("album")) {
            const albumId = contextUri.split(":")[2];
            await fetchAlbumTracks(albumId);
          }
        }
      } catch (error) {
        console.error("Error polling context:", error);
      }
    };

    pollContextChanges();
    const interval = setInterval(pollContextChanges, 5000);
    return () => clearInterval(interval);
  }, [token, isActive, currentContextUri]);

  // Update track index whenever current track changes
  useEffect(() => {
    if (currentTrack && playlistTracks.length > 0) {
      const index = playlistTracks.findIndex(
        (t: any) => t.id === currentTrack.id
      );
      if (index >= 0) {
        setCurrentTrackIndex(index);
        console.log("Updated track index:", index, "/", playlistTracks.length);
      }
    }
  }, [currentTrack, playlistTracks]);

  const fetchPlaylistTracks = async (playlistId: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      const tracks = data.items
        .map((item: any) => item.track)
        .filter((t: any) => t && t.id);
      setPlaylistTracks(tracks);
      console.log("✅ Fetched playlist tracks:", tracks.length);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  const fetchAlbumTracks = async (albumId: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      const tracks = data.items.filter((t: any) => t && t.id);

      const fullTracks = await Promise.all(
        tracks.map(async (track: any) => {
          const trackResponse = await fetch(
            `https://api.spotify.com/v1/tracks/${track.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return await trackResponse.json();
        })
      );

      setPlaylistTracks(fullTracks);
      console.log("✅ Fetched album tracks:", fullTracks.length);
    } catch (error) {
      console.error("Error fetching album:", error);
    }
  };

  // Update progress bar continuously
  useEffect(() => {
    if (!isPaused && isActive) {
      const interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 1;
          return newTime >= duration ? duration : newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaused, isActive, duration]);

  // Transfer playback
  const transferPlaybackToVyl = async () => {
    if (!deviceId || !token) return;

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: true,
        }),
      });

      if (response.ok || response.status === 204) {
        console.log("Playback transferred to Vyl!");
      }
    } catch (error) {
      console.error("Failed to transfer playback:", error);
    }
  };

  // Initialize Spotify SDK
  useEffect(() => {
    if (!token) return;

    if (window.Spotify) {
      initializePlayer();
      return;
    }

    const existingScript = document.getElementById("spotify-player-script");
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.id = "spotify-player-script";
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer();
    };

    function initializePlayer() {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Vyl Music Player",
        getOAuthToken: (cb: (token: string) => void) => cb(token!),
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        }
      );

      spotifyPlayer.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      spotifyPlayer.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState | null) => {
          if (!state) {
            setIsActive(false);
            return;
          }

          setCurrentTrack(state.track_window.current_track);
          setIsPaused(state.paused);
          setIsActive(true);
          setCurrentTime(state.position / 1000);
          setDuration(state.duration / 1000);
          setPreviousTracks(state.track_window.previous_tracks);
          setNextTracks(state.track_window.next_tracks);
        }
      );

      spotifyPlayer.connect();
    }

    return () => {
      if (player) player.disconnect();
    };
  }, [token]);

  const handlePlayPause = () => {
    if (!player) return;
    player
      .togglePlay()
      .catch((error) => console.error("Toggle play error:", error));
  };

  const handleNextTrack = () => {
    if (!player) return;
    player
      .nextTrack()
      .catch((error) => console.error("Next track error:", error));
  };

  const handlePreviousTrack = () => {
    if (!player) return;
    player
      .previousTrack()
      .catch((error) => console.error("Previous track error:", error));
  };

  const handleSeek = (value: number[]) => {
    if (!player) return;
    setCurrentTime(value[0]);
    player
      .seek(value[0] * 1000)
      .catch((error) => console.error("Seek error:", error));
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const displayPreviousTracks =
    playlistTracks.length > 0 && currentTrackIndex >= 0
      ? playlistTracks.slice(
          Math.max(0, currentTrackIndex - 4),
          currentTrackIndex
        )
      : previousTracks;

  const displayNextTracks =
    playlistTracks.length > 0 && currentTrackIndex >= 0
      ? playlistTracks.slice(
          currentTrackIndex + 1,
          Math.min(playlistTracks.length, currentTrackIndex + 5)
        )
      : nextTracks;

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please login to Spotify</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <MeshGradientBackground
        albumImageUrl={currentTrack?.album?.images?.[0]?.url}
      />
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between">
        <LibraryDropdown
          token={token!}
          onPlaylistSelect={handlePlaylistSelect}
        />
        <FullscreenButton />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <AlbumCarousel
          currentTrack={currentTrack}
          previousTracks={displayPreviousTracks}
          nextTracks={displayNextTracks}
          onNext={handleNextTrack}
          onPrevious={handlePreviousTrack}
        />
        <SongInfo currentTrack={currentTrack} />
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          isActive={isActive}
          onSeek={handleSeek}
          formatTime={formatTime}
        />
        <PlayerControls
          token={token!}
          isPaused={isPaused}
          isActive={isActive}
          isLiked={isLiked}
          volume={volume}
          isShuffle={isShuffle}
          crossfadeDuration={crossfadeDuration}
          onCrossfadeChange={setCrossfadeDuration}
          onPlayPause={handlePlayPause}
          onPrevious={handlePreviousTrack}
          onNext={handleNextTrack}
          onLike={() => setIsLiked(!isLiked)}
          onVolumeChange={handleVolumeChange}
          onShuffleToggle={handleShuffleToggle}
        />

        <ConnectionStatus
          isActive={isActive}
          deviceId={deviceId}
          onTransferPlayback={transferPlaybackToVyl}
        />
      </div>
    </div>
  );
}
