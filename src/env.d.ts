// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Public (client-side accessible)
  readonly PUBLIC_SPOTIFY_CLIENT_ID: string;
  readonly PUBLIC_SPOTIFY_REDIRECT_URI: string;

  // Server-only
  readonly SPOTIFY_CLIENT_SECRET: string;
  readonly SPOTIFY_REFRESH_TOKEN?: string; // Optional for now
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
