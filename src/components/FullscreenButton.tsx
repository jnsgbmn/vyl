// src/components/FullscreenButton.tsx
import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize className="w-5 h-5 text-white" />
      ) : (
        <Maximize className="w-5 h-5 text-white" />
      )}
    </button>
  );
}
