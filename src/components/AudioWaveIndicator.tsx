// src/components/AudioWaveIndicator.tsx
export default function AudioWaveIndicator() {
  return (
    <div className="flex items-center gap-0.5 h-4">
      <div
        className="w-0.5 bg-green-500 rounded-full animate-wave"
        style={{ animationDelay: "0ms", height: "60%" }}
      />
      <div
        className="w-0.5 bg-green-500 rounded-full animate-wave"
        style={{ animationDelay: "150ms", height: "100%" }}
      />
      <div
        className="w-0.5 bg-green-500 rounded-full animate-wave"
        style={{ animationDelay: "300ms", height: "80%" }}
      />
      <div
        className="w-0.5 bg-green-500 rounded-full animate-wave"
        style={{ animationDelay: "450ms", height: "40%" }}
      />
    </div>
  );
}
