// src/components/LibraryDropdown.tsx
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Library, Music, ChevronDown } from "lucide-react";

interface LibraryDropdownProps {
  token: string;
  onPlaylistSelect: (playlistId: string, playlistName: string) => void;
}

export default function LibraryDropdown({
  token,
  onPlaylistSelect,
}: LibraryDropdownProps) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("Library");

  useEffect(() => {
    fetchPlaylists();
  }, [token]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setPlaylists(data.items || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = async (
    playlistId: string,
    playlistName: string
  ) => {
    setSelectedPlaylist(playlistName);

    try {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: `spotify:playlist:${playlistId}`,
        }),
      });

      onPlaylistSelect(playlistId, playlistName);
    } catch (error) {
      console.error("Error playing playlist:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm">
          <Library className="w-5 h-5" />
          <span className="font-medium">{selectedPlaylist}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
        <DropdownMenuLabel className="text-white font-semibold">
          Your Library
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        {loading ? (
          <DropdownMenuItem disabled className="text-gray-400">
            Loading playlists...
          </DropdownMenuItem>
        ) : playlists.length === 0 ? (
          <DropdownMenuItem disabled className="text-gray-400">
            No playlists found
          </DropdownMenuItem>
        ) : (
          playlists.map((playlist) => (
            <DropdownMenuItem
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id, playlist.name)}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer text-white hover:bg-white/20 focus:bg-white/25 transition-colors rounded-lg my-1"
            >
              {playlist.images?.[0]?.url ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-white/50" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{playlist.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {playlist.tracks.total} tracks
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>

      {/* Custom scrollbar styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: background-color 0.2s;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      `,
        }}
      />
    </DropdownMenu>
  );
}
