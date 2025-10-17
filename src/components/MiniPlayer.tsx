// src/components/MiniPlayer.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, X } from "lucide-react";

interface MiniPlayerProps {
  currentTrack: any;
  isPaused: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function MiniPlayer({
  currentTrack,
  isPaused,
  onPlayPause,
  onNext,
  onClose,
}: MiniPlayerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.hidden && !isPaused);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPaused]);

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-[9999] w-80"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentTrack.album?.images?.[0]?.url}
              alt={currentTrack.name}
              className="w-16 h-16 rounded-lg"
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {currentTrack.name}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {currentTrack.artists?.[0]?.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPlayPause}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isPaused ? (
                  <Play className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Pause className="w-5 h-5" fill="currentColor" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
