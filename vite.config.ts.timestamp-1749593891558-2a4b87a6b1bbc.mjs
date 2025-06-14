// vite.config.ts
import { defineConfig } from "file:///C:/Users/pabll/Desktop/RENOVVA%20MAIS%20APP/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/pabll/Desktop/RENOVVA%20MAIS%20APP/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/pabll/Desktop/RENOVVA%20MAIS%20APP/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\pabll\\Desktop\\RENOVVA MAIS APP";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "cloudflare:sockets": path.resolve(__vite_injected_original_dirname, "./src/lib/cloudflare-sockets-fallback.js"),
      "events": path.resolve(__vite_injected_original_dirname, "./src/lib/events-polyfill.js"),
      "buffer": path.resolve(__vite_injected_original_dirname, "./src/lib/buffer-polyfill.js"),
      "crypto": path.resolve(__vite_injected_original_dirname, "./src/lib/crypto-polyfill.js"),
      "util": path.resolve(__vite_injected_original_dirname, "./src/lib/util-polyfill.js")
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
        "process.env": JSON.stringify({}),
        "process.browser": "true",
        "process.version": '"v16.0.0"',
        "process.platform": '"browser"'
      }
    }
  },
  define: {
    "process.env": {},
    "process.browser": true,
    "process.version": '"v16.0.0"',
    "process.platform": '"browser"'
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwYWJsbFxcXFxEZXNrdG9wXFxcXFJFTk9WVkEgTUFJUyBBUFBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHBhYmxsXFxcXERlc2t0b3BcXFxcUkVOT1ZWQSBNQUlTIEFQUFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcGFibGwvRGVza3RvcC9SRU5PVlZBJTIwTUFJUyUyMEFQUC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IFwiOjpcIixcclxuICAgIHBvcnQ6IDgwODAsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxyXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXHJcbiAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgIFwiY2xvdWRmbGFyZTpzb2NrZXRzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbGliL2Nsb3VkZmxhcmUtc29ja2V0cy1mYWxsYmFjay5qc1wiKSxcclxuICAgICAgXCJldmVudHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9saWIvZXZlbnRzLXBvbHlmaWxsLmpzXCIpLFxyXG4gICAgICBcImJ1ZmZlclwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2xpYi9idWZmZXItcG9seWZpbGwuanNcIiksXHJcbiAgICAgIFwiY3J5cHRvXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbGliL2NyeXB0by1wb2x5ZmlsbC5qc1wiKSxcclxuICAgICAgXCJ1dGlsXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbGliL3V0aWwtcG9seWZpbGwuanNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBkZWZpbmU6IHtcclxuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcclxuICAgICAgICAncHJvY2Vzcy5lbnYnOiBKU09OLnN0cmluZ2lmeSh7fSksXHJcbiAgICAgICAgJ3Byb2Nlc3MuYnJvd3Nlcic6ICd0cnVlJyxcclxuICAgICAgICAncHJvY2Vzcy52ZXJzaW9uJzogJ1widjE2LjAuMFwiJyxcclxuICAgICAgICAncHJvY2Vzcy5wbGF0Zm9ybSc6ICdcImJyb3dzZXJcIicsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICAncHJvY2Vzcy5lbnYnOiB7fSxcclxuICAgICdwcm9jZXNzLmJyb3dzZXInOiB0cnVlLFxyXG4gICAgJ3Byb2Nlc3MudmVyc2lvbic6ICdcInYxNi4wLjBcIicsXHJcbiAgICAncHJvY2Vzcy5wbGF0Zm9ybSc6ICdcImJyb3dzZXJcIicsXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFULFNBQVMsb0JBQW9CO0FBQ2xWLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxzQkFBc0IsS0FBSyxRQUFRLGtDQUFXLDBDQUEwQztBQUFBLE1BQ3hGLFVBQVUsS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUFBLE1BQ2hFLFVBQVUsS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUFBLE1BQ2hFLFVBQVUsS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUFBLE1BQ2hFLFFBQVEsS0FBSyxRQUFRLGtDQUFXLDRCQUE0QjtBQUFBLElBQzlEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixlQUFlLEtBQUssVUFBVSxDQUFDLENBQUM7QUFBQSxRQUNoQyxtQkFBbUI7QUFBQSxRQUNuQixtQkFBbUI7QUFBQSxRQUNuQixvQkFBb0I7QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxJQUNoQixtQkFBbUI7QUFBQSxJQUNuQixtQkFBbUI7QUFBQSxJQUNuQixvQkFBb0I7QUFBQSxFQUN0QjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
