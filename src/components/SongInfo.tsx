// src/components/SongInfo.tsx - Display last played track
interface SongInfoProps {
  currentTrack: any;
}

export default function SongInfo({ currentTrack }: SongInfoProps) {
  if (!currentTrack) {
    return (
      <div className="text-center mb-4 sm:mb-6 w-full max-w-2xl px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-500 leading-tight">
          Welcome to Vyl
        </h1>
        <p className="text-base sm:text-lg text-gray-400">
          Select a song to start playing
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-4 sm:mb-6 w-full max-w-2xl px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
        {currentTrack.name}
      </h1>
      <p className="text-base sm:text-lg text-gray-400">
        {currentTrack.artists?.map((artist: any) => artist.name).join(", ") ||
          "Unknown Artist"}
      </p>
    </div>
  );
}
