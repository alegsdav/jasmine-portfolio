import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";

// astro.config.mjs runs as plain Node, outside Vite's module graph, so
// import.meta.env isn't available here — read .env files directly instead.
const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
const sentryDsn = env.PUBLIC_SENTRY_DSN;

export default defineConfig({
  site: "https://jamstain.art",
  server: {
    port: 5173,
  },
  integrations: [
    sitemap(),
    // Only enabled once PUBLIC_SENTRY_DSN is set (see .env.example) — keeps
    // local/dev builds free of Sentry entirely until you've created a project.
    // (Passing `dsn` here prints a "deprecated" notice at build time — Sentry
    // now prefers a sentry.client.config.ts file, but that file is always
    // bundled once present, which would ship Sentry's SDK even when disabled.
    // Safe to ignore the warning.)
    ...(sentryDsn ? [sentry({ dsn: sentryDsn })] : []),
  ],
  // Every page is pre-rendered static HTML, so prefetching a link's target
  // costs almost nothing and makes gallery → artwork navigation feel instant.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});
