// src/components/CallbackContent.tsx - CORRECTED
import { useEffect, useState } from "react";
import MeshGradientBackground from "./MeshGradientBackground";

export default function CallbackContent() {
  const [status, setStatus] = useState("Connecting to Spotify...");

  useEffect(() => {
    exchangeCodeForToken();
  }, []);

  async function exchangeCodeForToken() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setStatus(`Login failed: ${error}`);
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    if (!code) {
      setStatus("No authorization code received");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    setStatus("Exchanging code for access token...");

    try {
      // ✅ FIXED: Use server-side API endpoint (secure)
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || "Token exchange failed");
      }

      const data = await response.json();

      setStatus("Success! Redirecting to music player...");

      // Store tokens
      localStorage.setItem("spotify_access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("spotify_refresh_token", data.refresh_token);
      }

      const expiryTime = Date.now() + data.expires_in * 1000;
      localStorage.setItem("spotify_token_expiry", expiryTime.toString());

      // Redirect to app
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch (error: any) {
      console.error("Token exchange error:", error);
      setStatus(`Token exchange failed: ${error.message}`);
      setTimeout(() => (window.location.href = "/login"), 3000);
    }
  }

  return (
    <div className="min-h-screen relative text-white flex items-center justify-center overflow-hidden">
      <MeshGradientBackground albumImageUrl={undefined} />

      <div className="text-center max-w-md px-6 relative z-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#78ebff] mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Connecting to Spotify</h2>
        <p className="text-gray-400">{status}</p>
      </div>
    </div>
  );
}
