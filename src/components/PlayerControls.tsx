// src/components/PlayerControls.tsx
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Shuffle } from "lucide-react";
import VolumeControl from "./VolumeControl";
import CrossfadeControl from "./CrossfadeControl";

interface PlayerControlsProps {
  token: string;
  isPaused: boolean;
  isActive: boolean;
  isLiked: boolean;
  volume: number;
  isShuffle: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLike: () => void;
  onVolumeChange: (volume: number) => void;
  onShuffleToggle: () => void;
  crossfadeDuration?: number;
  onCrossfadeChange?: (duration: number) => void;
}

export default function PlayerControls({
  token,
  isPaused,
  isActive,
  volume,
  isShuffle,
  onPlayPause,
  onPrevious,
  onNext,
  onVolumeChange,
  onShuffleToggle,
  onCrossfadeChange, // Added this
}: PlayerControlsProps) {
  return (
    <div className="flex   flex-col items-center gap-4 mb-8">
      {/* Main playback controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Shuffle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none transition-colors"
          style={{ color: isShuffle ? "#22c55e" : "white" }}
          onClick={onShuffleToggle}
          disabled={!isActive}
        >
          <Shuffle className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-none"
          onClick={onPrevious}
          disabled={!isActive}
        >
          <SkipBack className="h-6 w-6" fill="currentColor" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="!h-14 !w-14 !rounded-full !p-0 !min-w-0"
          onClick={onPlayPause}
          disabled={!isActive}
        >
          {isPaused ? (
            <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
          ) : (
            <Pause className="h-6 w-6" fill="currentColor" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-none"
          onClick={onNext}
          disabled={!isActive}
        >
          <SkipForward className="h-6 w-6" fill="currentColor" />
        </Button>

        <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
      </div>

      <div className="relative">
        <CrossfadeControl token={token} onCrossfadeChange={onCrossfadeChange} />
      </div>
    </div>
  );
}
