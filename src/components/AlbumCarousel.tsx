// src/components/AlbumCarousel.tsx - WITH REFLECTIONS & ADJUSTED SIZES
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AlbumCarouselProps {
  currentTrack: any;
  previousTracks: any[];
  nextTracks: any[];
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AlbumCarousel({
  currentTrack,
  previousTracks,
  nextTracks,
  onNext,
  onPrevious,
}: AlbumCarouselProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [direction, setDirection] = useState(0);

  const leftTracks = previousTracks
    .filter(
      (track) => track?.album?.images?.[0]?.url || track?.images?.[0]?.url
    )
    .slice(-4)
    .reverse();

  const rightTracks = nextTracks
    .filter(
      (track) => track?.album?.images?.[0]?.url || track?.images?.[0]?.url
    )
    .slice(0, 4);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onNext) {
      setDirection(1);
      onNext();
    }
    if (isRightSwipe && onPrevious) {
      setDirection(-1);
      onPrevious();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -25 : 25,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 25 : -25,
    }),
  };

  return (
    <div
      className="relative mb-8 md:mb-12 h-[300px] sm:h-[380px] md:h-[550px] w-full flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing select-none px-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: "2000px" }}
    >
      <div className="flex items-end justify-center gap-3 md:gap-6">
        {/* Left side albums */}
        {leftTracks.slice(0, 2).map((track, index) => {
          const distance = leftTracks.slice(0, 2).length - index;
          const imageUrl =
            track?.album?.images?.[0]?.url || track?.images?.[0]?.url;

          return (
            <motion.div
              key={`left-${track.id}-${index}`}
              className="relative hidden sm:block"
              initial={{ opacity: 0, x: -150, scale: 0.7 }}
              animate={{
                opacity: 0.4 + index * 0.15,
                x: 0,
                scale: 0.75 + index * 0.05,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 25,
                mass: 0.5,
                delay: index * 0.05,
              }}
              style={{
                width: `${160 - distance * 20}px`,
                height: `${160 - distance * 20}px`,
                transformStyle: "preserve-3d",
                transform: `translateY(${distance * 12}px) rotateY(${
                  distance * 12
                }deg) translateZ(-${distance * 50}px)`,
              }}
            >
              <motion.div
                className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl bg-gray-900"
                whileHover={{
                  scale: 1.08,
                  rotateY: 0,
                  translateZ: 20,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onPrevious}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={track?.album?.name || track?.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                )}
              </motion.div>

              {/* Reflection for previous albums */}
              {imageUrl && (
                <motion.div
                  className="absolute top-full left-0 w-full rounded-xl md:rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  style={{
                    height: "60px",
                    background: `url(${imageUrl}) center/cover`,
                    transform: "scaleY(-1) translateY(8px)",
                    opacity: 0.15 + index * 0.05,
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 70%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 70%)",
                    filter: "blur(2px)",
                  }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Center album - Current track */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentTrack?.id || "default"}
            className="relative z-10 mx-2 sm:mx-4 md:mx-6"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 28,
              mass: 0.8,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
              whileHover={{
                scale: 1.03,
                rotateY: 3,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 },
              }}
            >
              {currentTrack?.album?.images?.[0]?.url ? (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center text-white/70">
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Center reflection */}
            {currentTrack?.album?.images?.[0]?.url && (
              <motion.div
                className=" absolute top-full left-0 w-full rounded-2xl md:rounded-3xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  height: "100px",
                  background: `url(${currentTrack.album.images[0].url}) center/cover`,
                  transform: "scaleY(-1) translateY(15px)",
                  opacity: 0.3,
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 70%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 70%)",
                  filter: "blur(3px)",
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right side albums */}
        {rightTracks.slice(0, 2).map((track, index) => {
          const distance = index + 1;
          const imageUrl =
            track?.album?.images?.[0]?.url || track?.images?.[0]?.url;

          return (
            <motion.div
              key={`right-${track.id}-${index}`}
              className="relative hidden sm:block"
              initial={{ opacity: 0, x: 150, scale: 0.7 }}
              animate={{
                opacity: 0.5 - index * 0.12,
                x: 0,
                scale: 0.9 - index * 0.05,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 25,
                mass: 0.5,
                delay: index * 0.05,
              }}
              style={{
                width: `${160 - distance * 20}px`,
                height: `${160 - distance * 20}px`,
                transformStyle: "preserve-3d",
                transform: `translateY(${distance * 12}px) rotateY(-${
                  distance * 12
                }deg) translateZ(-${distance * 50}px)`,
              }}
            >
              <motion.div
                className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl bg-gray-900"
                whileHover={{
                  scale: 1.08,
                  rotateY: 0,
                  translateZ: 20,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={track?.album?.name || track?.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                )}
              </motion.div>

              {/* Reflection for next albums */}
              {imageUrl && (
                <motion.div
                  className="absolute top-full left-0 w-full rounded-xl md:rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  style={{
                    height: "60px",
                    background: `url(${imageUrl}) center/cover`,
                    transform: "scaleY(-1) translateY(8px)",
                    opacity: 0.2 - index * 0.06,
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 70%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 70%)",
                    filter: "blur(2px)",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
