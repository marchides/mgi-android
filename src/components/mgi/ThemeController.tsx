import { useEffect } from "react";
import { useSettings } from "@/lib/mgi/store";
import { accentByName } from "@/lib/mgi/themes";

/**
 * Applies theme mode (light/dark/system) and accent color as CSS vars.
 * Mounted once at the app root.
 */
export function ThemeController() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark =
        settings.themeMode === "dark" ||
        (settings.themeMode === "system" && prefersDark);
      root.classList.toggle("dark", dark);
      const accent = accentByName(settings.accent);
      const val = dark ? accent.dark : accent.light;
      root.style.setProperty("--accent-oklch", val);
      root.style.setProperty("--on-accent-oklch", accent.onAccent);
      const hue = val.split(" ")[2] ?? "260";
      root.style.setProperty("--accent-hue", hue);
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [settings.themeMode, settings.accent]);

  return null;
}
