import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Config Vite
export default defineConfig({
  plugins: [react()],
  // CSS compatibile anche con iPhone vecchi (iOS 15):
  // converte la sintassi nuova, es. (width <= 650px)
  build: {
    cssTarget: ["safari15", "chrome100", "firefox100"],
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
    // Link Cloudflare per provare la bussola dal telefono
    allowedHosts: [".trycloudflare.com"],
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    allowedHosts: [".trycloudflare.com"],
  },
});
