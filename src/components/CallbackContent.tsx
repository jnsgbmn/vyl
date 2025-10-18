// src/components/CallbackContent.tsx - PREVENT REFRESH ISSUE
import { useEffect, useState } from "react";
import MeshGradientBackground from "./MeshGradientBackground";

export default function CallbackContent() {
  const [status, setStatus] = useState("Connecting to Spotify...");

  useEffect(() => {
    // Prevent back/forward navigation to this page
    window.history.replaceState(null, "", "/");

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
      // Redirect to home if no code (likely a refresh)
      setTimeout(() => (window.location.href = "/"), 1000);
      return;
    }

    setStatus("Exchanging code for access token...");

    try {
      const response = await fetch("http://localhost:4321/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error_description ||
            errorData.error ||
            "Token exchange failed"
        );
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

      // Clean URL and redirect
      window.history.replaceState(null, "", "/");

      // Redirect to app
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);

      // If authorization code already used, redirect to login
      if (
        error.message.includes("Authorization code") ||
        error.message.includes("invalid_grant")
      ) {
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setTimeout(() => (window.location.href = "/login"), 3000);
      }
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
