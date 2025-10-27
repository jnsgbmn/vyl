// src/components/PlayerControls.tsx
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";

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
  repeatMode: "off" | "context" | "track";
  onRepeatToggle: () => void;
}

export default function PlayerControls({
  token,
  isPaused,
  repeatMode,
  isActive,
  volume,
  isShuffle,
  onPlayPause,
  onPrevious,
  onNext,
  onRepeatToggle,
  onVolumeChange,
  onShuffleToggle,
  onCrossfadeChange,
}: PlayerControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6 mb-8">
      {/* Playback Controls Row */}
      <div className="flex items-center justify-center gap-6">
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
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none transition-colors"
          style={{ color: repeatMode !== "off" ? "#22c55e" : "white" }}
          onClick={onRepeatToggle}
          disabled={!isActive}
        >
          {repeatMode === "track" ? (
            <Repeat1 className="h-5 w-5" />
          ) : (
            <Repeat className="h-5 w-5" />
          )}
        </Button>
      </div>
      {/* Sliders/Extras in a separate row */}
      <div className="flex gap-4 items-center justify-center">
        <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
        <CrossfadeControl token={token} onCrossfadeChange={onCrossfadeChange} />
      </div>
    </div>
  );
}
