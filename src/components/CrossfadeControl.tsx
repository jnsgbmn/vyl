// src/components/CrossfadeControl.tsx - RESPONSIVE
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, X } from "lucide-react";

interface CrossfadeControlProps {
  token: string;
  onCrossfadeChange?: (duration: number) => void;
}

export default function CrossfadeControl({
  token,
  onCrossfadeChange,
}: CrossfadeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCrossfadeChange = async (value: number) => {
    setCrossfadeDuration(value);
    setError(null);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/crossfade?duration_ms=${
          value * 1000
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        console.log(`✅ Crossfade set to ${value} seconds`);
        onCrossfadeChange?.(value);
        setError(null);
      } else if (response.status === 403) {
        setError("Premium required");
      } else if (response.status === 404) {
        setError("No active device - start playback first");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error?.message || `Error ${response.status}`);
      }
    } catch (error) {
      console.error("Error setting crossfade:", error);
      setError("Network error");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCrossfadeDuration(value);
  };

  const handleSliderRelease = () => {
    handleCrossfadeChange(crossfadeDuration);
  };

  return (
    <>
      {/* Crossfade Button - Responsive size */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 sm:p-3 rounded-full backdrop-blur-sm transition-colors ${
          crossfadeDuration > 0
            ? "bg-purple-500/30 text-white"
            : "bg-white/10 text-white/70 hover:text-white"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Waves className="w-4 h-4 sm:w-5 sm:h-5" />

        {/* Active indicator */}
        {crossfadeDuration > 0 && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.button>

      {/* Crossfade Panel - Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-x-4 bottom-24 sm:absolute sm:inset-x-auto sm:bottom-full sm:mb-4 sm:right-0 w-auto sm:w-80 bg-black/95 sm:bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl z-50 max-w-md mx-auto sm:mx-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Crossfade
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-white/60 mb-4 sm:mb-6">
              Seamlessly blend songs together for uninterrupted playback
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Duration Display */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-white/70">Duration</span>
              <motion.span
                key={crossfadeDuration}
                initial={{ scale: 1.2, color: "#a855f7" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-base sm:text-lg font-bold"
              >
                {crossfadeDuration}s
              </motion.span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={crossfadeDuration}
                onChange={handleSliderChange}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${
                    (crossfadeDuration / 12) * 100
                  }%, rgba(255,255,255,0.1) ${
                    (crossfadeDuration / 12) * 100
                  }%, rgba(255,255,255,0.1) 100%)`,
                }}
              />

              {/* Progress markers */}
              <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-white/40">
                <span>Off</span>
                <span className="hidden sm:inline">3s</span>
                <span>6s</span>
                <span className="hidden sm:inline">9s</span>
                <span>12s</span>
              </div>
            </div>

            {/* Visual indicator */}
            <motion.div
              className="mt-4 sm:mt-6 h-16 sm:h-20 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 overflow-hidden relative"
              animate={{
                opacity: crossfadeDuration > 0 ? 1 : 0.3,
              }}
            >
              {/* Animated waves */}
              {crossfadeDuration > 0 && (
                <>
                  <motion.div
                    className="absolute inset-0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear",
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.5) 50%, transparent 100%)",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "linear",
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.5) 50%, transparent 100%)",
                    }}
                  />
                </>
              )}

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs sm:text-sm text-white/70 font-medium">
                  {crossfadeDuration > 0
                    ? `${crossfadeDuration}s overlap`
                    : "Disabled"}
                </span>
              </div>
            </motion.div>

            {/* Info */}
            <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-white/50 text-center">
              Requires Spotify Premium & active playback
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
