// src/components/MeshGradientBackground.tsx
import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState, useRef } from "react";

interface MeshGradientBackgroundProps {
  albumImageUrl?: string;
  defaultColors?: string[];
}

export default function MeshGradientBackground({
  albumImageUrl,
  defaultColors = ["#ffffff", "#87dede", "#ffc099", "#815d90"],
}: MeshGradientBackgroundProps) {
  const [colors, setColors] = useState(defaultColors);
  const [isMounted, setIsMounted] = useState(false);
  const [dims, setDims] = useState({ width: 1920, height: 1080 });
  const defaultColorsRef = useRef(defaultColors);

  // Set window dimensions
  useEffect(() => {
    function handleResize() {
      setDims({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    setIsMounted(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!albumImageUrl) {
      setColors(defaultColorsRef.current);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = albumImageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const extractedColors = extractColors(imageData);

        console.log("Extracted colors:", extractedColors);
        setColors(extractedColors);
      } catch (error) {
        console.error("Error extracting colors:", error);
        setColors(defaultColorsRef.current);
      }
    };

    img.onerror = () => {
      setColors(defaultColorsRef.current);
    };
  }, [albumImageUrl, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* MeshGradient with dynamic dimensions */}
      <div
        className="fixed inset-0 w-screen h-screen"
        style={{
          zIndex: -20,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <MeshGradient
          width={dims.width}
          height={dims.height}
          colors={colors}
          distortion={0.8}
          swirl={0.1}
          grainMixer={0}
          grainOverlay={0}
          speed={0.8}
        />
      </div>

      {/* Dark overlay for text contrast */}
      <div
        className="fixed inset-0 bg-black/65 pointer-events-none"
        style={{ zIndex: -10 }}
      />
    </>
  );
}

function extractColors(imageData: ImageData): string[] {
  const data = imageData.data;
  const colorCounts: { [key: string]: number } = {};

  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brightness = (r + g + b) / 3;
    if (brightness < 20 || brightness > 235) continue;

    const colorKey = `${Math.floor(r / 30) * 30},${Math.floor(g / 30) * 30},${
      Math.floor(b / 30) * 30
    }`;
    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
  }

  const sortedColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([color]) => {
      const [r, g, b] = color.split(",").map(Number);
      return rgbToHex(r, g, b);
    });

  while (sortedColors.length < 4) {
    sortedColors.push("#9f50d3");
  }

  // Brighten colors for better visibility
  return sortedColors.map((color) => brightenColor(color, 1.8));
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.min(255, x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function brightenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return rgbToHex(
    Math.min(255, Math.floor(r * factor)),
    Math.min(255, Math.floor(g * factor)),
    Math.min(255, Math.floor(b * factor))
  );
}
