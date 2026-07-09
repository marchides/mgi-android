/**
 * Capacitor config placeholder for the future Android wrap.
 *
 * This file is inert until you actually install Capacitor:
 *
 *   npm install @capacitor/core @capacitor/cli @capacitor/android
 *   npx cap add android
 *   npx cap sync android
 *
 * See README → "Android Play Store Build Path".
 */
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.monty.glminterface",
  appName: "Monty's GLM Interface",
  webDir: "dist",
  // Version name / code are set in android/app/build.gradle after `npx cap add android`.
  // Keep them in sync with these values on every release:
  //   versionName "1.0.0"
  //   versionCode 1
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
