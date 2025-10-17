// src/components/App.tsx - EVEN SIMPLER
import { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";

export default function App() {
  const [token, setToken] = useState<string | null>(() => {
    // Initialize state immediately from localStorage
    const storedToken = localStorage.getItem("spotify_access_token");
    const expiry = localStorage.getItem("spotify_token_expiry");

    if (storedToken && expiry && Date.now() < parseInt(expiry)) {
      return storedToken;
    }

    // Redirect if no valid token
    window.location.href = "/login";
    return null;
  });

  if (!token) {
    return null;
  }

  return <MusicPlayer token={token} />;
}
