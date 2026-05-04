import { serverTimestamp } from "firebase/firestore";

export const THEME_PRESETS: Record<string, any> = {
  "dark-cyan": {
    themeName: "dark-cyan",
    label: "Dark Cyan",
    mode: "dark",
    primary: "#22d3ee",
    secondary: "#67e8f9",
    backgroundMain: "#020617",
    backgroundSurface: "#0b1220",
    backgroundCard: "#111827",
    backgroundSoft: "#1e293b",
    textMain: "#f8fafc",
    textMuted: "#cbd5e1",
    textSoft: "#94a3b8",
    borderColor: "rgba(148, 163, 184, 0.18)",
    buttonText: "#020617",
    chipBg: "rgba(34, 211, 238, 0.12)",
    chipText: "#67e8f9",
    inputBg: "#020617",
    inputText: "#f8fafc",
    heroOverlayStart: "rgba(2, 6, 23, 0.76)",
    heroOverlayEnd: "rgba(2, 6, 23, 0.28)",
    shadow: "rgba(0, 0, 0, 0.34)"
  ,
    tabBg: "rgba(15, 23, 42, 0.92)",
    tabText: "#e2e8f0",
    tabBorder: "rgba(148, 163, 184, 0.22)",
    tabActiveBg: "rgba(34, 211, 238, 0.15)",
    tabActiveText: "#020617",
    tabActiveBorder: "#22d3ee"
  },
  "light-clean": {
    themeName: "light-clean",
    label: "Light Clean",
    mode: "light",
    primary: "#0f766e",
    secondary: "#0891b2",
    backgroundMain: "#f8fafc",
    backgroundSurface: "#ffffff",
    backgroundCard: "#ffffff",
    backgroundSoft: "#e2e8f0",
    textMain: "#0f172a",
    textMuted: "#334155",
    textSoft: "#64748b",
    borderColor: "rgba(15, 23, 42, 0.14)",
    buttonText: "#ffffff",
    chipBg: "rgba(15, 118, 110, 0.10)",
    chipText: "#0f766e",
    inputBg: "#ffffff",
    inputText: "#0f172a",
    tabBg: "#ffffff",
    tabText: "#0f172a",
    tabBorder: "rgba(15, 23, 42, 0.14)",
    tabActiveText: "#ffffff",
    heroOverlayStart: "rgba(255, 255, 255, 0.80)",
    heroOverlayEnd: "rgba(255, 255, 255, 0.28)",
    shadow: "rgba(15, 23, 42, 0.14)"
  },
  "soft-pink": {
    themeName: "soft-pink",
    label: "Soft Pink",
    mode: "light",
    primary: "#be185d",
    secondary: "#db2777",
    backgroundMain: "#fff7fb",
    backgroundSurface: "#ffffff",
    backgroundCard: "#ffffff",
    backgroundSoft: "#fce7f3",
    textMain: "#1f1720",
    textMuted: "#4a3340",
    textSoft: "#7a5a69",
    borderColor: "rgba(190, 24, 93, 0.18)",
    buttonText: "#ffffff",
    chipBg: "rgba(190, 24, 93, 0.10)",
    chipText: "#9d174d",
    inputBg: "#ffffff",
    inputText: "#1f1720",
    tabBg: "#ffffff",
    tabText: "#1f1720",
    tabBorder: "rgba(190, 24, 93, 0.18)",
    tabActiveText: "#ffffff",
    heroOverlayStart: "rgba(255, 247, 251, 0.82)",
    heroOverlayEnd: "rgba(255, 247, 251, 0.28)",
    shadow: "rgba(190, 24, 93, 0.13)"
  },
  "emerald-fresh": {
    themeName: "emerald-fresh",
    label: "Emerald Fresh",
    mode: "light",
    primary: "#047857",
    secondary: "#059669",
    backgroundMain: "#f0fdf4",
    backgroundSurface: "#ffffff",
    backgroundCard: "#ffffff",
    backgroundSoft: "#dcfce7",
    textMain: "#052e16",
    textMuted: "#14532d",
    textSoft: "#166534",
    borderColor: "rgba(4, 120, 87, 0.18)",
    buttonText: "#ffffff",
    chipBg: "rgba(4, 120, 87, 0.10)",
    chipText: "#047857",
    inputBg: "#ffffff",
    inputText: "#052e16",
    tabBg: "#ffffff",
    tabText: "#052e16",
    tabBorder: "rgba(4, 120, 87, 0.18)",
    tabActiveText: "#ffffff",
    heroOverlayStart: "rgba(240, 253, 244, 0.82)",
    heroOverlayEnd: "rgba(240, 253, 244, 0.28)",
    shadow: "rgba(4, 120, 87, 0.13)"
  },
  "purple-night": {
    themeName: "purple-night",
    label: "Purple Night",
    mode: "dark",
    primary: "#c084fc",
    secondary: "#a855f7",
    backgroundMain: "#0f0718",
    backgroundSurface: "#180f25",
    backgroundCard: "#211331",
    backgroundSoft: "#312047",
    textMain: "#faf5ff",
    textMuted: "#ddd6fe",
    textSoft: "#c4b5fd",
    borderColor: "rgba(192, 132, 252, 0.22)",
    buttonText: "#1f0b33",
    chipBg: "rgba(192, 132, 252, 0.14)",
    chipText: "#e9d5ff",
    inputBg: "#13091f",
    inputText: "#faf5ff",
    tabBg: "#211331",
    tabText: "#f3e8ff",
    tabBorder: "rgba(192, 132, 252, 0.22)",
    tabActiveText: "#1f0b33",
    heroOverlayStart: "rgba(15, 7, 24, 0.80)",
    heroOverlayEnd: "rgba(15, 7, 24, 0.32)",
    shadow: "rgba(0, 0, 0, 0.36)"
  },
  "red-velvet": {
    themeName: "red-velvet",
    label: "Red Velvet",
    mode: "dark",
    primary: "#fb7185",
    secondary: "#f43f5e",
    backgroundMain: "#16070b",
    backgroundSurface: "#240d13",
    backgroundCard: "#301018",
    backgroundSoft: "#4a1d2a",
    textMain: "#fff1f2",
    textMuted: "#fecdd3",
    textSoft: "#fda4af",
    borderColor: "rgba(251, 113, 133, 0.22)",
    buttonText: "#2a0a10",
    chipBg: "rgba(251, 113, 133, 0.14)",
    chipText: "#ffe4e6",
    inputBg: "#18070b",
    inputText: "#fff1f2",
    tabBg: "#301018",
    tabText: "#ffe4e6",
    tabBorder: "rgba(251, 113, 133, 0.22)",
    tabActiveText: "#2a0a10",
    heroOverlayStart: "rgba(22, 7, 11, 0.80)",
    heroOverlayEnd: "rgba(22, 7, 11, 0.32)",
    shadow: "rgba(0, 0, 0, 0.36)"
  },
  "blue-ocean": {
    themeName: "blue-ocean",
    label: "Blue Ocean",
    mode: "dark",
    primary: "#60a5fa",
    secondary: "#3b82f6",
    backgroundMain: "#061226",
    backgroundSurface: "#0b1d3a",
    backgroundCard: "#10284d",
    backgroundSoft: "#1e3a5f",
    textMain: "#eff6ff",
    textMuted: "#bfdbfe",
    textSoft: "#93c5fd",
    borderColor: "rgba(96, 165, 250, 0.22)",
    buttonText: "#061226",
    chipBg: "rgba(96, 165, 250, 0.14)",
    chipText: "#dbeafe",
    inputBg: "#07172e",
    inputText: "#eff6ff",
    tabBg: "#10284d",
    tabText: "#dbeafe",
    tabBorder: "rgba(96, 165, 250, 0.22)",
    tabActiveText: "#061226",
    heroOverlayStart: "rgba(6, 18, 38, 0.80)",
    heroOverlayEnd: "rgba(6, 18, 38, 0.32)",
    shadow: "rgba(0, 0, 0, 0.36)"
  },
  "gold-luxury": {
    themeName: "gold-luxury",
    label: "Gold Luxury",
    mode: "dark",
    primary: "#facc15",
    secondary: "#f59e0b",
    backgroundMain: "#120d05",
    backgroundSurface: "#1f1608",
    backgroundCard: "#2a1f0d",
    backgroundSoft: "#3b2a12",
    textMain: "#fffbeb",
    textMuted: "#fde68a",
    textSoft: "#fbbf24",
    borderColor: "rgba(250, 204, 21, 0.24)",
    buttonText: "#120d05",
    chipBg: "rgba(250, 204, 21, 0.14)",
    chipText: "#fef3c7",
    inputBg: "#171006",
    inputText: "#fffbeb",
    tabBg: "#2a1f0d",
    tabText: "#fef3c7",
    tabBorder: "rgba(250, 204, 21, 0.24)",
    tabActiveText: "#120d05",
    heroOverlayStart: "rgba(18, 13, 5, 0.80)",
    heroOverlayEnd: "rgba(18, 13, 5, 0.32)",
    shadow: "rgba(0, 0, 0, 0.36)"
  }
};

export function applyGlobalTheme(theme: any) {
  const defaultTheme = THEME_PRESETS["dark-cyan"];

  const safeTheme = {
    ...defaultTheme,
    ...theme
  };

  const root = document.documentElement;

  // New Theme Variables
  root.style.setProperty("--theme-primary", safeTheme.primary);
  root.style.setProperty("--theme-secondary", safeTheme.secondary);
  root.style.setProperty("--theme-bg-main", safeTheme.backgroundMain);
  root.style.setProperty("--theme-bg-surface", safeTheme.backgroundSurface);
  root.style.setProperty("--theme-bg-card", safeTheme.backgroundCard);
  root.style.setProperty("--theme-bg-soft", safeTheme.backgroundSoft);
  root.style.setProperty("--theme-text-main", safeTheme.textMain);
  root.style.setProperty("--theme-text-muted", safeTheme.textMuted);
  root.style.setProperty("--theme-text-soft", safeTheme.textSoft);
  root.style.setProperty("--theme-border", safeTheme.borderColor);
  root.style.setProperty("--theme-button-text", safeTheme.buttonText);
  root.style.setProperty("--theme-chip-bg", safeTheme.chipBg || "rgba(34, 211, 238, 0.12)");
  root.style.setProperty("--theme-chip-text", safeTheme.chipText || "#67e8f9");
  root.style.setProperty("--theme-input-bg", safeTheme.inputBg || safeTheme.backgroundMain);
  root.style.setProperty("--theme-input-text", safeTheme.inputText || safeTheme.textMain);
  root.style.setProperty("--theme-tab-bg", safeTheme.tabBg);
  root.style.setProperty("--theme-tab-text", safeTheme.tabText);
  root.style.setProperty("--theme-tab-border", safeTheme.tabBorder);
  root.style.setProperty("--theme-tab-active-bg", safeTheme.primary);
  root.style.setProperty("--theme-tab-active-text", safeTheme.tabActiveText || safeTheme.buttonText);
  root.style.setProperty("--theme-tab-active-border", safeTheme.primary);
  root.style.setProperty("--theme-hero-overlay-start", safeTheme.heroOverlayStart || "rgba(2, 6, 23, 0.76)");
  root.style.setProperty("--theme-hero-overlay-end", safeTheme.heroOverlayEnd || "rgba(2, 6, 23, 0.28)");
  root.style.setProperty("--theme-shadow", safeTheme.shadow || "rgba(0, 0, 0, 0.32)");
  root.style.setProperty("--theme-mode", safeTheme.mode || "dark");
  
  // Legacy Variables Supported to prevent breaking
  root.style.setProperty("--bg-main", safeTheme.backgroundMain);
  root.style.setProperty("--bg-card", safeTheme.backgroundCard);
  root.style.setProperty("--bg-surface", safeTheme.backgroundSurface);
  root.style.setProperty("--site-primary", safeTheme.primary);
  root.style.setProperty("--accent", safeTheme.primary);
  root.style.setProperty("--site-bg", safeTheme.backgroundMain);
  root.style.setProperty("--site-card", safeTheme.backgroundCard);
  root.style.setProperty("--site-text", safeTheme.textMain);
  root.style.setProperty("--text-main", safeTheme.textMain);
  root.style.setProperty("--text-muted", safeTheme.textMuted);

  document.body.dataset.themeMode = safeTheme.mode || "dark";
}

export function hexToRgb(hex: string) {
  const clean = String(hex || "").replace("#", "");
  if (clean.length !== 6) return null;

  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16)
  };
}

export function getBrightness(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

export function getAutoTextColor(backgroundHex: string) {
  return getBrightness(backgroundHex) > 155 ? "#0f172a" : "#f8fafc";
}

export function getAutoMutedTextColor(backgroundHex: string) {
  return getBrightness(backgroundHex) > 155 ? "#475569" : "#cbd5e1";
}
