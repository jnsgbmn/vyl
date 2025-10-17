// src/components/SongInfo.tsx
interface SongInfoProps {
  currentTrack: any;
}

export default function SongInfo({ currentTrack }: SongInfoProps) {
  return (
    <div className="text-center mb-6 w-full max-w-2xl px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {currentTrack?.name || "No track playing"}
      </h1>
      <p className="text-gray-400 text-lg">
        {currentTrack?.artists?.map((artist: any) => artist.name).join(", ") ||
          "Unknown Artist"}
      </p>
    </div>
  );
}
