import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'placeholder.svg'],
      manifest: {
        name: 'Learn2Master',
        short_name: 'L2M',
        description: 'AI-Powered A-Level E-Learning for Uganda',
        theme_color: '#1b7a67',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: '/icons/l2m-logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icons/l2m-logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/api\/v1\/recommendations\/.*/i,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'api-recommendations',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 } // 1 hour
            }
          },
          {
            urlPattern: /\/api\/v1\/(lessons|subjects|classes|assignments|users\/profile).*/i,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'api-content',
              networkTimeoutSeconds: 2, // Fast fallback to cache
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 14 } // 2 weeks
            }
          },
          {
            urlPattern: /\/api\/v1\/static\/.*/i,
            handler: 'CacheFirst', // Aggressive caching for static assets
            method: 'GET',
            options: {
              cacheName: 'static-content',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 } // 30 days
            }
          }
        ],
        // Offline fallback for navigation
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
