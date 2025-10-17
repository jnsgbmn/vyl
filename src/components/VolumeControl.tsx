// src/components/VolumeControl.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Volume1 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeControl({
  volume,
  onVolumeChange,
}: VolumeControlProps) {
  const [showSlider, setShowSlider] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSlider(false);
      }
    };

    if (showSlider) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSlider]);

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    onVolumeChange(newVolume);
    setIsMuted(newVolume === 0);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 50) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none"
        onClick={() => setShowSlider(!showSlider)}
        onDoubleClick={handleMuteToggle}
      >
        {getVolumeIcon()}
      </Button>

      {showSlider && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-2xl border border-gray-800 min-w-[180px]">
          <div className="flex items-center gap-2">
            {/* Volume icon */}
            <button
              onClick={handleMuteToggle}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              {getVolumeIcon()}
            </button>

            {/* Horizontal slider */}
            <div className="flex-1">
              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="w-full"
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
