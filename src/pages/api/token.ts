// src/pages/api/token.ts
export async function POST({ request }: { request: Request }) {
  try {
    const { code } = await request.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "No authorization code provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const client_id = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID;
    const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = import.meta.env.PUBLIC_SPOTIFY_REDIRECT_URI;

    console.log("🔍 Token exchange:", {
      client_id,
      redirect_uri,
      hasSecret: !!client_secret,
      hasCode: !!code,
    });

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
      },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Spotify API error:", data);
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ Token exchange successful");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("❌ API error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
