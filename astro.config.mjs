import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "http://127.0.0.1:4321",
  output: "server",
  adapter: vercel(),
  server: {
    port: 4321,
    host: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: {
    // Exclude WebGL libraries from SSR
    noExternal: ["@paper-design/shaders-react"],
  },
  optimizeDeps: {
    // Include WebGL dependencies
    include: ["@paper-design/shaders-react"],
  },
});
