import type { AccentName } from "./types";

export interface AccentDef {
  name: AccentName;
  label: string;
  // oklch triples for light and dark accents
  light: string;
  dark: string;
  onAccent: string; // foreground on filled accent surface
}

export const ACCENTS: AccentDef[] = [
  { name: "yellow", label: "Yellow", light: "0.82 0.17 92", dark: "0.86 0.17 92", onAccent: "0.2 0.02 90" },
  { name: "hotOrange", label: "Hot Orange", light: "0.68 0.21 40", dark: "0.72 0.21 40", onAccent: "1 0 0" },
  { name: "cobalt", label: "Cobalt", light: "0.55 0.22 260", dark: "0.66 0.22 260", onAccent: "1 0 0" },
  { name: "purple", label: "Purple", light: "0.55 0.24 300", dark: "0.68 0.24 300", onAccent: "1 0 0" },
  { name: "red", label: "Red", light: "0.58 0.24 25", dark: "0.68 0.24 25", onAccent: "1 0 0" },
  { name: "emerald", label: "Emerald", light: "0.62 0.16 155", dark: "0.72 0.16 155", onAccent: "1 0 0" },
  { name: "lime", label: "Lime", light: "0.82 0.2 130", dark: "0.86 0.2 130", onAccent: "0.15 0.02 130" },
];

export function accentByName(name: AccentName): AccentDef {
  return ACCENTS.find((a) => a.name === name) ?? ACCENTS[2];
}
