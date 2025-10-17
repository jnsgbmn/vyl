// src/components/App.tsx
import { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    const expiry = localStorage.getItem("spotify_token_expiry");

    if (storedToken && expiry && Date.now() < parseInt(expiry)) {
      setToken(storedToken);
      setLoading(false);
    } else {
      // Redirect to login
      window.location.href = "/login";
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <MusicPlayer token={token} />;
}
