/**
 * Capacitor config for wrapping MGI as an Android app.
 *
 * This file is inert until you actually install Capacitor:
 *
 *   npm install @capacitor/core @capacitor/cli @capacitor/android
 *   npx cap add android
 *   npx cap sync android
 *
 * IMPORTANT — build output:
 *   MGI is built with TanStack Start (SSR-first). `npm run build` emits:
 *     - dist/client/        static client bundle + manifest + icons + sw.js
 *     - dist/server/        Nitro server bundle (SSR HTML renderer)
 *     - dist/sw.js          precached service worker
 *   TanStack Start does NOT emit a static `index.html` in dist/client, so
 *   pointing `webDir` at `dist/client` alone will NOT load the app in a
 *   Capacitor WebView. Two supported paths:
 *
 *   A) RECOMMENDED — Hosted WebView (point the app at your deployed URL).
 *      Deploy `dist/` to Cloudflare Pages / Vercel / Netlify, then set
 *      `server.url` below. This is the simplest way to ship a Play Store
 *      build without prerendering. See README → "Android Play Store Build Path".
 *
 *   B) Prerender-then-wrap (if you need fully offline). Prerender the
 *      routes to static HTML into `dist/client` (e.g. with a `nitro`
 *      prerender step or a static export) and remove `server.url` below.
 *
 * See README → "Android Play Store Build Path" for full instructions.
 */
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.monty.glminterface",
  appName: "Monty's GLM Interface",
  // Static assets folder for path (A) fallback and for icons/splash tooling.
  // The actual runtime HTML comes from `server.url` below in path (A).
  webDir: "dist/client",
  // Version name / code are set in android/app/build.gradle after `npx cap add android`.
  // Keep them in sync with these values on every release:
  //   versionName "1.0.0"
  //   versionCode 1
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
    // Path (A): point the WebView at your deployed MGI URL.
    // Uncomment and set this after deploying `dist/` to a static/edge host:
    // url: "https://mgi.example.com",
    // cleartext: false,
  },
};

export default config;
