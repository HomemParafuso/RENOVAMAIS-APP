import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "cloudflare:sockets": path.resolve(__dirname, "./src/lib/cloudflare-sockets-fallback.js"),
      "events": path.resolve(__dirname, "./src/lib/events-polyfill.js"),
      "buffer": path.resolve(__dirname, "./src/lib/buffer-polyfill.js"),
      "crypto": path.resolve(__dirname, "./src/lib/crypto-polyfill.js"),
      "util": path.resolve(__dirname, "./src/lib/util-polyfill.js"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
        'process.env': JSON.stringify({}),
        'process.browser': 'true',
        'process.version': '"v16.0.0"',
        'process.platform': '"browser"',
      },
    },
  },
  define: {
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"',
    'process.platform': '"browser"',
  },
}));
