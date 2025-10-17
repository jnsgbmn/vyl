// src/components/ProgressBar.tsx
import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  isActive: boolean;
  onSeek: (value: number[]) => void;
  formatTime: (seconds: number) => string;
}

export default function ProgressBar({
  currentTime,
  duration,
  isActive,
  onSeek,
  formatTime,
}: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl px-4 mb-8">
      {/* Progress bar with time on both sides */}
      <div className="flex items-center gap-3">
        {/* Current time - LEFT */}
        <span className="text-xs text-gray-400 font-medium min-w-[40px] text-left">
          {formatTime(currentTime)}
        </span>

        {/* Progress bar */}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          className="flex-1"
          onValueChange={onSeek}
          disabled={!isActive}
        />

        {/* Remaining time - RIGHT */}
        <span className="text-xs text-gray-400 font-medium min-w-[48px] text-right">
          -{formatTime(Math.max(0, duration - currentTime))}
        </span>
      </div>
    </div>
  );
}
