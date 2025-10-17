// src/env.d.ts (RENAMED from vite-env.d.ts)
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // ✅ FIXED: Use PUBLIC_ prefix for client-side variables
  readonly PUBLIC_SPOTIFY_CLIENT_ID: string;
  readonly PUBLIC_SPOTIFY_REDIRECT_URI: string;

  // Server-side only (no PUBLIC_ prefix)
  readonly SPOTIFY_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
