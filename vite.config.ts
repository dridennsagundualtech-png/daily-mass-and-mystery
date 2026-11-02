// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        manifest: false,
        devOptions: { enabled: false },
        workbox: {
          globPatterns: ["**/*.{js,css,woff,woff2,svg,ico,webmanifest}"],
          navigateFallback: null,
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ request, url, sameOrigin }) =>
                sameOrigin &&
                !url.pathname.startsWith("/~oauth") &&
                (request.mode === "navigate" || (request.headers.get("accept") ?? "").includes("text/html")),
              handler: "NetworkFirst",
              options: { cacheName: "sc-pages", networkTimeoutSeconds: 4, expiration: { maxEntries: 60 } },
            },
            {
              urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/assets\/.+-[A-Za-z0-9_-]{6,}\.(js|css|woff2?)$/.test(url.pathname),
              handler: "CacheFirst",
              options: { cacheName: "sc-assets", expiration: { maxEntries: 200 } },
            },
          ],
        },
      }),
    ],
  },
});
