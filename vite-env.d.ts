// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_CLIENT_ID: string;
  readonly VITE_SPOTIFY_REDIRECT_URI: string;
  readonly SPOTIFY_CLIENT_SECRET: string; // Server-side only
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
