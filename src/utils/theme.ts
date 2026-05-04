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
    primary: "#0891b2",
    secondary: "#0e7490",
    backgroundMain: "#f8fafc",
    backgroundSurface: "#ffffff",
    backgroundCard: "#ffffff",
    backgroundSoft: "#e2e8f0",
    textMain: "#0f172a",
    textMuted: "#334155",
    textSoft: "#64748b",
    borderColor: "rgba(15, 23, 42, 0.14)",
    buttonText: "#ffffff",
    chipBg: "rgba(8, 145, 178, 0.10)",
    chipText: "#0e7490",
    inputBg: "#ffffff",
    inputText: "#0f172a",
    heroOverlayStart: "rgba(255, 255, 255, 0.78)",
    heroOverlayEnd: "rgba(255, 255, 255, 0.26)",
    shadow: "rgba(15, 23, 42, 0.14)"
  ,
    tabBg: "#ffffff",
    tabText: "#0f172a",
    tabBorder: "rgba(15, 23, 42, 0.14)",
    tabActiveBg: "#0891b2",
    tabActiveText: "#ffffff",
    tabActiveBorder: "#0891b2"
  },
  "soft-pink": {
    themeName: "soft-pink",
    label: "Soft Pink",
    mode: "light",
    primary: "#db2777",
    secondary: "#be185d",
    backgroundMain: "#fff7fb",
    backgroundSurface: "#ffffff",
    backgroundCard: "#ffffff",
    backgroundSoft: "#fce7f3",
    textMain: "#1f1720",
    textMuted: "#4a3340",
    textSoft: "#7a5a69",
    borderColor: "rgba(219, 39, 119, 0.18)",
    buttonText: "#ffffff",
    chipBg: "rgba(219, 39, 119, 0.10)",
    chipText: "#be185d",
    inputBg: "#ffffff",
    inputText: "#1f1720",
    heroOverlayStart: "rgba(255, 247, 251, 0.78)",
    heroOverlayEnd: "rgba(255, 247, 251, 0.24)",
    shadow: "rgba(219, 39, 119, 0.13)"
  ,
    tabBg: "#ffffff",
    tabText: "#1f1720",
    tabBorder: "rgba(219, 39, 119, 0.18)",
    tabActiveBg: "#db2777",
    tabActiveText: "#ffffff",
    tabActiveBorder: "#db2777"
  },
  "purple-night": {
    themeName: "purple-night",
    label: "Purple Night",
    mode: "dark",
    primary: "#a855f7",
    secondary: "#c084fc",
    backgroundMain: "#0f0718",
    backgroundSurface: "#180f25",
    backgroundCard: "#211331",
    backgroundSoft: "#312047",
    textMain: "#faf5ff",
    textMuted: "#ddd6fe",
    textSoft: "#c4b5fd",
    borderColor: "rgba(168, 85, 247, 0.22)",
    buttonText: "#ffffff",
    chipBg: "rgba(168, 85, 247, 0.14)",
    chipText: "#e9d5ff",
    inputBg: "#13091f",
    inputText: "#faf5ff",
    heroOverlayStart: "rgba(15, 7, 24, 0.78)",
    heroOverlayEnd: "rgba(15, 7, 24, 0.30)",
    shadow: "rgba(0, 0, 0, 0.36)"
  ,
    tabBg: "rgba(24, 15, 37, 0.92)",
    tabText: "#e9d5ff",
    tabBorder: "rgba(168, 85, 247, 0.22)",
    tabActiveBg: "#a855f7",
    tabActiveText: "#ffffff",
    tabActiveBorder: "#a855f7"
  },
  "emerald-fresh": {
    themeName: "emerald-fresh",
    label: "Emerald Fresh",
    mode: "light",
    primary: "#059669",
    secondary: "#047857",
    backgroundMain: "#f0fdf4",
    backgroundSurface: "#ffffff",
    backgroundCard: "#ffffff",
    backgroundSoft: "#dcfce7",
    textMain: "#052e16",
    textMuted: "#14532d",
    textSoft: "#166534",
    borderColor: "rgba(5, 150, 105, 0.18)",
    buttonText: "#ffffff",
    chipBg: "rgba(5, 150, 105, 0.10)",
    chipText: "#047857",
    inputBg: "#ffffff",
    inputText: "#052e16",
    heroOverlayStart: "rgba(240, 253, 244, 0.78)",
    heroOverlayEnd: "rgba(240, 253, 244, 0.24)",
    shadow: "rgba(5, 150, 105, 0.13)"
  ,
    tabBg: "#ffffff",
    tabText: "#052e16",
    tabBorder: "rgba(5, 150, 105, 0.18)",
    tabActiveBg: "#059669",
    tabActiveText: "#ffffff",
    tabActiveBorder: "#059669"
  },
  "red-velvet": {
    themeName: "red-velvet",
    label: "Red Velvet",
    mode: "dark",
    primary: "#f43f5e",
    secondary: "#fb7185",
    backgroundMain: "#16070b",
    backgroundSurface: "#240d13",
    backgroundCard: "#301018",
    backgroundSoft: "#4a1d2a",
    textMain: "#fff1f2",
    textMuted: "#fecdd3",
    textSoft: "#fda4af",
    borderColor: "rgba(244, 63, 94, 0.22)",
    buttonText: "#ffffff",
    chipBg: "rgba(244, 63, 94, 0.14)",
    chipText: "#fecdd3",
    inputBg: "#18070b",
    inputText: "#fff1f2",
    heroOverlayStart: "rgba(22, 7, 11, 0.78)",
    heroOverlayEnd: "rgba(22, 7, 11, 0.30)",
    shadow: "rgba(0, 0, 0, 0.36)"
  ,
    tabBg: "rgba(36, 13, 19, 0.92)",
    tabText: "#fecdd3",
    tabBorder: "rgba(244, 63, 94, 0.22)",
    tabActiveBg: "#f43f5e",
    tabActiveText: "#ffffff",
    tabActiveBorder: "#f43f5e"
  },
  "blue-ocean": {
    themeName: "blue-ocean",
    label: "Blue Ocean",
    mode: "dark",
    primary: "#3b82f6",
    secondary: "#60a5fa",
    backgroundMain: "#061226",
    backgroundSurface: "#0b1d3a",
    backgroundCard: "#10284d",
    backgroundSoft: "#1e3a5f",
    textMain: "#eff6ff",
    textMuted: "#bfdbfe",
    textSoft: "#93c5fd",
    borderColor: "rgba(59, 130, 246, 0.22)",
    buttonText: "#ffffff",
    chipBg: "rgba(59, 130, 246, 0.14)",
    chipText: "#dbeafe",
    inputBg: "#07172e",
    inputText: "#eff6ff",
    heroOverlayStart: "rgba(6, 18, 38, 0.78)",
    heroOverlayEnd: "rgba(6, 18, 38, 0.30)",
    shadow: "rgba(0, 0, 0, 0.36)"
  ,
    tabBg: "rgba(11, 29, 58, 0.92)",
    tabText: "#dbeafe",
    tabBorder: "rgba(59, 130, 246, 0.22)",
    tabActiveBg: "#3b82f6",
    tabActiveText: "#ffffff",
    tabActiveBorder: "#3b82f6"
  },
  "gold-luxury": {
    themeName: "gold-luxury",
    label: "Gold Luxury",
    mode: "dark",
    primary: "#f59e0b",
    secondary: "#fbbf24",
    backgroundMain: "#120d05",
    backgroundSurface: "#1f1608",
    backgroundCard: "#2a1f0d",
    backgroundSoft: "#3b2a12",
    textMain: "#fffbeb",
    textMuted: "#fde68a",
    textSoft: "#fbbf24",
    borderColor: "rgba(245, 158, 11, 0.24)",
    buttonText: "#120d05",
    chipBg: "rgba(245, 158, 11, 0.14)",
    chipText: "#fde68a",
    inputBg: "#171006",
    inputText: "#fffbeb",
    heroOverlayStart: "rgba(18, 13, 5, 0.78)",
    heroOverlayEnd: "rgba(18, 13, 5, 0.30)",
    shadow: "rgba(0, 0, 0, 0.36)"
  ,
    tabBg: "rgba(31, 22, 8, 0.92)",
    tabText: "#fde68a",
    tabBorder: "rgba(245, 158, 11, 0.24)",
    tabActiveBg: "#f59e0b",
    tabActiveText: "#120d05",
    tabActiveBorder: "#f59e0b"
  }
};

export function applyGlobalTheme(theme: any) {
  const safeTheme = {
    ...THEME_PRESETS["dark-cyan"],
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
  root.style.setProperty("--theme-hero-overlay-start", safeTheme.heroOverlayStart || "rgba(2, 6, 23, 0.76)");
  root.style.setProperty("--theme-hero-overlay-end", safeTheme.heroOverlayEnd || "rgba(2, 6, 23, 0.28)");
  root.style.setProperty("--theme-shadow", safeTheme.shadow || "rgba(0, 0, 0, 0.32)");
  root.style.setProperty("--theme-tab-bg", safeTheme.tabBg);
  root.style.setProperty("--theme-tab-text", safeTheme.tabText);
  root.style.setProperty("--theme-tab-border", safeTheme.tabBorder);
  root.style.setProperty("--theme-tab-active-bg", safeTheme.tabActiveBg);
  root.style.setProperty("--theme-tab-active-text", safeTheme.tabActiveText);
  root.style.setProperty("--theme-tab-active-border", safeTheme.tabActiveBorder);
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
