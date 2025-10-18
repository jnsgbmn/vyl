// src/components/MusicPlayer.tsx - CLEANED UP
import { useState, useEffect } from "react";
import AlbumCarousel from "./AlbumCarousel";
import SongInfo from "./SongInfo";
import ProgressBar from "./ProgressBar";
import PlayerControls from "./PlayerControls";
import ConnectionStatus from "./ConnectionStatus";
import MeshGradientBackground from "./MeshGradientBackground";
import FullscreenButton from "./FullscreenButton";
import LibraryDropdown from "./LibraryDropdown";
import PlaylistSheet from "./PlaylistSheet";

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

  const handleTrackSelect = async (track: any, index: number) => {
    if (!token || !track) return;

    try {
      // Play the selected track
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [track.uri],
        }),
      });
    } catch {}
  };

  useEffect(() => {
    if (!token || currentTrack || isActive) return;

    const fetchCurrentPlayback = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.item) {
            setCurrentTrack(data.item);
            setDuration(data.item.duration_ms / 1000);
            setCurrentTime(data.progress_ms / 1000);
            setIsPaused(!data.is_playing);
            return;
          }
        }
        fetchRecentlyPlayed();
      } catch {
        fetchRecentlyPlayed();
      }
    };

    const fetchRecentlyPlayed = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=1",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          const lastTrack = data.items?.[0]?.track;
          if (lastTrack) {
            setCurrentTrack(lastTrack);
            setDuration(lastTrack.duration_ms / 1000);
            setCurrentTime(0);
            setIsPaused(true);
          }
        }
      } catch {}
    };

    fetchCurrentPlayback();
  }, [token, currentTrack, isActive]);

  // Update browser tab title dynamically
  useEffect(() => {
    if (currentTrack && !isPaused) {
      const trackName = currentTrack.name;
      const artistName = currentTrack.artists?.[0]?.name || "Unknown Artist";
      document.title = ` ${trackName} - ${artistName}`;
    } else if (currentTrack && isPaused) {
      const trackName = currentTrack.name;
      const artistName = currentTrack.artists?.[0]?.name || "Unknown Artist";
      document.title = ` ${trackName} - ${artistName}`;
    } else {
      document.title = "Vyl - Music Player";
    }
  }, [currentTrack, isPaused]);

  const handlePlaylistSelect = (playlistId: string) => {
    // Playlist selection logic here
  };

  const handleShuffleToggle = async () => {
    if (!token) return;

    const newShuffleState = !isShuffle;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok || response.status === 204) {
        setIsShuffle(newShuffleState);
      }
    } catch {}
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    player?.setVolume(newVolume / 100).catch(() => {});
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
          setCurrentContextUri(contextUri);

          if (contextUri.includes("playlist")) {
            const playlistId = contextUri.split(":")[2];
            await fetchPlaylistTracks(playlistId);
          } else if (contextUri.includes("album")) {
            const albumId = contextUri.split(":")[2];
            await fetchAlbumTracks(albumId);
          }
        }
      } catch {}
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
      if (index >= 0) setCurrentTrackIndex(index);
    }
  }, [currentTrack, playlistTracks]);

  const fetchPlaylistTracks = async (playlistId: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      const tracks = data.items
        .map((item: any) => item.track)
        .filter((t: any) => t?.id);
      setPlaylistTracks(tracks);
    } catch {}
  };

  const fetchAlbumTracks = async (albumId: string) => {
    try {
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

      setPlaylistTracks(fullTracks);
    } catch {}
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
      await fetch("https://api.spotify.com/v1/me/player", {
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
    } catch {}
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
        volume: 0.2,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
        }
      );

      spotifyPlayer.addListener("not_ready", () => {});

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
      player?.disconnect();
    };
  }, [token]);

  const handlePlayPause = () => player?.togglePlay().catch(() => {});
  const handleNextTrack = () => player?.nextTrack().catch(() => {});
  const handlePreviousTrack = () => player?.previousTrack().catch(() => {});

  const handleSeek = (value: number[]) => {
    if (!player) return;
    setCurrentTime(value[0]);
    player.seek(value[0] * 1000).catch(() => {});
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
    <div className="min-h-screen relative text-white flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <MeshGradientBackground
        albumImageUrl={currentTrack?.album?.images?.[0]?.url}
      />

      {/* Header - Better mobile spacing */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50 flex items-center justify-between">
        <LibraryDropdown
          token={token!}
          onPlaylistSelect={handlePlaylistSelect}
        />
        <FullscreenButton />
      </div>

      {/* Main content - Optimized for mobile */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center px-2 sm:px-4">
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

        {/* Connection status - Better mobile positioning */}
        <div className="mt-4 sm:mt-6">
          <ConnectionStatus
            isActive={isActive}
            deviceId={deviceId}
            onTransferPlayback={transferPlaybackToVyl}
          />
        </div>
        <PlaylistSheet
          tracks={playlistTracks}
          currentTrack={currentTrack}
          onTrackSelect={handleTrackSelect}
          isPaused={isPaused}
        />
      </div>
    </div>
  );
}
