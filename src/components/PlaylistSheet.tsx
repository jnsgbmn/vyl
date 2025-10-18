// src/components/PlaylistSheet.tsx - CENTERED WITH MAX WIDTH
import { useState, useRef } from "react";
import { ChevronUp, Music } from "lucide-react";
import AudioWaveIndicator from "./AudioWaveIndicator";

interface PlaylistSheetProps {
  tracks: any[];
  currentTrack: any;
  isPaused: boolean;
  onTrackSelect: (track: any, index: number) => void;
}

export default function PlaylistSheet({
  tracks,
  currentTrack,
  isPaused,
  onTrackSelect,
}: PlaylistSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const diff = startY - currentY;
    if (diff > 50) {
      setIsOpen(true);
    } else if (diff < -50) {
      setIsOpen(false);
    }
    setStartY(0);
    setCurrentY(0);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <>
      {/* Centered Container with Max Width */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div
          className={`w-full max-w-5xl transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-[calc(100%-80px)]"
          }`}
          ref={sheetRef}
        >
          {/* Swipe Handle - Frosted Glass */}
          <div
            className="flex justify-center py-4 cursor-pointer bg-white/10 backdrop-blur-2xl rounded-t-3xl border-t border-white/20"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-col items-center gap-1">
              {/* Drag Handle Bar */}
              <div className="w-12 h-1 bg-white/30 rounded-full mb-2" />

              <div className="flex items-center gap-2 text-white/80">
                <ChevronUp
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {isOpen ? "Hide Queue" : "Up Next"} • {tracks.length} songs
                </span>
              </div>
            </div>
          </div>

          {/* Playlist Content - Frosted Glass */}
          <div className="bg-white/10 backdrop-blur-2xl border-t border-white/10 overflow-hidden">
            <div
              className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-1"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 90%, transparent 100%)",
              }}
            >
              <div className="px-3 py-2 space-y-1">
                {tracks.map((track, index) => {
                  const isCurrentTrack = track.id === currentTrack?.id;
                  const isPlaying = isCurrentTrack && !isPaused;

                  return (
                    <div
                      key={track.id || index}
                      onClick={() => onTrackSelect(track, index)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                        isCurrentTrack
                          ? "bg-white/20 border border-white/30 shadow-lg"
                          : "hover:bg-white/10 active:bg-white/15"
                      }`}
                    >
                      {/* Album Art with Audio Indicator */}
                      <div className="relative flex-shrink-0">
                        {track.album?.images?.[0]?.url ? (
                          <img
                            src={track.album.images[0].url}
                            alt={track.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                            <Music className="w-6 h-6 text-white/40" />
                          </div>
                        )}

                        {/* Show Audio Wave Indicator when playing */}
                        {isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                            <AudioWaveIndicator />
                          </div>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isCurrentTrack
                              ? "text-green-400 drop-shadow-md"
                              : "text-white/90"
                          }`}
                        >
                          {track.name}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                          {track.artists?.map((a: any) => a.name).join(", ") ||
                            "Unknown Artist"}
                        </p>
                      </div>

                      {/* Duration or Audio Indicator */}
                      {isPlaying ? (
                        <AudioWaveIndicator />
                      ) : (
                        <span className="text-xs text-white/50 font-medium">
                          {formatDuration(track.duration_ms)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop - More transparent */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
