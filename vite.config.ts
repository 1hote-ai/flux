import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Prevent vite from obscuring Rust errors
  clearScreen: false,

  // Tauri expects a fixed port; fail if port is taken
  server: {
    port: 5173,
    strictPort: true,
    // Expose host for Tauri mobile dev (future-proofing)
    host: process.env.TAURI_DEV_HOST || false,
    hmr: process.env.TAURI_DEV_HOST
      ? {
          protocol: 'ws',
          host: process.env.TAURI_DEV_HOST,
          port: 5174,
        }
      : undefined,
  },

  // Tauri CLI outputs to process.env for env variables prefixed with TAURI_
  envPrefix: ['VITE_', 'TAURI_'],

  // ─── Production build optimizations ──────────────────────────────
  build: {
    target: 'es2022',
  },
})
