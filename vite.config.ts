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
    // Reduce chunk size for Tauri bundle
    target: 'es2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,     // Remove console.log in production
        drop_debugger: true,    // Remove debugger statements
        pure_funcs: ['console.info', 'console.debug', 'console.trace'],
      },
    },
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'motion': ['framer-motion'],
          'state': ['zustand'],
        },
      },
    },
    // Generate source maps only for dev
    sourcemap: process.env.NODE_ENV !== 'production',
    // Reduce CSS size
    cssMinify: true,
    // Chunk size warning threshold
    chunkSizeWarningLimit: 500,
  },
})
