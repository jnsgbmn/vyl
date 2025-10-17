// src/types/spotify.d.ts
interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: typeof Spotify;
}

declare namespace Spotify {
  interface Player {
    new (options: PlayerOptions): Player;
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(
      event: "ready",
      callback: (data: { device_id: string }) => void
    ): void;
    addListener(
      event: "not_ready",
      callback: (data: { device_id: string }) => void
    ): void;
    addListener(
      event: "player_state_changed",
      callback: (state: PlaybackState | null) => void
    ): void;
    addListener(event: "autoplay_failed", callback: () => void): void;
    removeListener(event: string, callback?: () => void): void;
    getCurrentState(): Promise<PlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
    activateElement(): Promise<void>;
  }

  interface PlayerOptions {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume?: number;
  }

  interface PlaybackState {
    context: {
      uri: string;
      metadata: object;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    paused: boolean;
    position: number;
    duration: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: TrackWindow;
    timestamp: number;
  }

  interface TrackWindow {
    current_track: Track;
    previous_tracks: Track[];
    next_tracks: Track[];
  }

  interface Track {
    uri: string;
    id: string | null;
    type: "track" | "episode" | "ad";
    media_type: "audio" | "video";
    name: string;
    is_playable: boolean;
    album: Album;
    artists: Artist[];
    duration_ms: number;
  }

  interface Album {
    uri: string;
    name: string;
    images: Image[];
  }

  interface Artist {
    uri: string;
    name: string;
  }

  interface Image {
    url: string;
    height: number | null;
    width: number | null;
  }

  interface Error {
    message: string;
  }
}
