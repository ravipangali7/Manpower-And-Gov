// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Skip Nitro so TanStack can prerender a classic SPA shell (index.html).
  // Nitro's cloudflare server entry (index.mjs) breaks SPA prerender, which
  // expects dist/server/server.js.
  nitro: false,
  vite: {
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    environments: {
      client: {
        build: {
          outDir: "dist",
        },
      },
      server: {
        build: {
          outDir: "dist/server",
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    // Prerender SPA shell as dist/index.html for static hosting.
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index",
      },
    },
  },
});
