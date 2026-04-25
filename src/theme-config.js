/**
 * Nova Editor — Theme Configuration System v2.1.0
 *
 * Each named theme is a complete, self-contained design token set.
 * Light and dark variants are separate named entries — there is no
 * global dark-mode override that bleeds across themes.
 *
 * CSS variables are injected as inline styles on the .ne-root element,
 * so every editor instance on the same page can have a different theme.
 */

// ── Token shape reference ─────────────────────────────────────────────────────
//
// colors:
//   primary        — main accent (buttons active state, borders, caret)
//   primaryLight   — tinted surface, hover backgrounds
//   primaryDark    — darker accent for text on light bg
//   primaryFg      — text colour on a primary-coloured background
//
// surfaces:
//   bg             — editor content background
//   toolbarBg      — toolbar + footer background
//   border         — all border colours
//   text           — primary text
//   textMuted      — placeholder, secondary labels
//   hover          — button hover background
//   activeBg       — active/pressed button background
//   activeText     — active/pressed button icon colour
//
// scrollbar:
//   scrollThumb    — scrollbar thumb colour
//   scrollHover    — scrollbar thumb hover colour
//
// shadow:          — box-shadow string for the container

export const NAMED_THEMES = {

  // ── Neutral base ────────────────────────────────────────────────────────────
  /**
   * base-light — Clean neutral, no colour personality.
   * The true default. Suitable when you want the editor to disappear
   * into the surrounding UI.
   */
  "base-light": {
    colorMode: "light",
    colors: {
      primary:      "#4b5563",
      primaryLight: "#f3f4f6",
      primaryDark:  "#1f2937",
      primaryFg:    "#ffffff",
    },
    surfaces: {
      bg:          "#ffffff",
      toolbarBg:   "#f9fafb",
      border:      "#e5e7eb",
      text:        "#111827",
      textMuted:   "#9ca3af",
      hover:       "#f3f4f6",
      activeBg:    "#e5e7eb",
      activeText:  "#111827",
    },
    scrollbar: { thumb: "rgba(107,114,128,0.3)", hover: "rgba(107,114,128,0.5)" },
    typography: {
      font:       "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      monoFont:   "ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },
    borders:  { radius: "0.5rem",  radiusBtn: "0.25rem", width: "1px" },
    toolbar:  { size: "2rem",      iconSize: "0.875rem", compact: false },
    shadow:   "0 1px 4px rgba(0,0,0,0.06)",
  },

  "base-dark": {
    colorMode: "dark",
    colors: {
      primary:      "#9ca3af",
      primaryLight: "#374151",
      primaryDark:  "#d1d5db",
      primaryFg:    "#111827",
    },
    surfaces: {
      bg:          "#111827",
      toolbarBg:   "#0f172a",
      border:      "rgba(255,255,255,0.1)",
      text:        "#f9fafb",
      textMuted:   "#6b7280",
      hover:       "rgba(255,255,255,0.06)",
      activeBg:    "rgba(255,255,255,0.1)",
      activeText:  "#f9fafb",
    },
    scrollbar: { thumb: "rgba(156,163,175,0.25)", hover: "rgba(156,163,175,0.4)" },
    typography: {
      font:       "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      monoFont:   "ui-monospace, SFMono-Regular, 'JetBrains Mono', monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },
    borders:  { radius: "0.5rem",  radiusBtn: "0.25rem", width: "1px" },
    toolbar:  { size: "2rem",      iconSize: "0.875rem", compact: false },
    shadow:   "0 4px 24px rgba(0,0,0,0.4)",
  },

  // ── Valiux ──────────────────────────────────────────────────────────────────
  /**
   * valiux-dark / valiux-light — Amber accent, Brand Nova identity.
   * Keep for Valiux project use. Can be removed from public builds.
   */
  "valiux-dark": {
    colorMode: "dark",
    colors: {
      primary:      "#f59e0b",
      primaryLight: "#fde68a",
      primaryDark:  "#b45309",
      primaryFg:    "#1c1008",
    },
    surfaces: {
      bg:          "#0f0f0f",
      toolbarBg:   "#141414",
      border:      "rgba(245,158,11,0.15)",
      text:        "#f5f0e8",
      textMuted:   "#a1998c",
      hover:       "rgba(245,158,11,0.1)",
      activeBg:    "rgba(245,158,11,0.2)",
      activeText:  "#fcd34d",
    },
    scrollbar: { thumb: "rgba(245,158,11,0.2)", hover: "rgba(245,158,11,0.4)" },
    typography: {
      font:       "'Syne', sans-serif",
      monoFont:   "'JetBrains Mono', monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },
    borders:  { radius: "0.75rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar:  { size: "2.25rem",   iconSize: "1rem",      compact: false },
    shadow:   "0 4px 32px rgba(0,0,0,0.5)",
  },

  "valiux-light": {
    colorMode: "light",
    colors: {
      primary:      "#d97706",
      primaryLight: "#fef3c7",
      primaryDark:  "#92400e",
      primaryFg:    "#ffffff",
    },
    surfaces: {
      bg:          "#fffbeb",
      toolbarBg:   "#fef3c7",
      border:      "#fcd34d",
      text:        "#1c1917",
      textMuted:   "#78716c",
      hover:       "#fde68a",
      activeBg:    "#fcd34d",
      activeText:  "#78350f",
    },
    scrollbar: { thumb: "rgba(217,119,6,0.25)", hover: "rgba(217,119,6,0.45)" },
    typography: {
      font:       "'Syne', sans-serif",
      monoFont:   "'JetBrains Mono', monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },
    borders:  { radius: "0.75rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar:  { size: "2.25rem",   iconSize: "1rem",      compact: false },
    shadow:   "0 4px 24px rgba(217,119,6,0.12)",
  },

  // ── Notion-inspired ─────────────────────────────────────────────────────────
  "notion-light": {
    colorMode: "light",
    colors: {
      primary:      "#2383e2",
      primaryLight: "#e8f3fe",
      primaryDark:  "#1565c0",
      primaryFg:    "#ffffff",
    },
    surfaces: {
      bg:          "#ffffff",
      toolbarBg:   "#ffffff",
      border:      "#e9e9e7",
      text:        "#37352f",
      textMuted:   "#9b9a97",
      hover:       "#f1f1ef",
      activeBg:    "#e8f3fe",
      activeText:  "#1565c0",
    },
    scrollbar: { thumb: "rgba(55,53,47,0.15)", hover: "rgba(55,53,47,0.3)" },
    typography: {
      font:       "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      monoFont:   "SFMono-Regular, 'SF Mono', Consolas, monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },
    borders:  { radius: "0.375rem", radiusBtn: "0.25rem", width: "1px" },
    toolbar:  { size: "2rem",       iconSize: "0.875rem", compact: false },
    shadow:   "0 1px 3px rgba(0,0,0,0.08)",
  },

  "notion-dark": {
    colorMode: "dark",
    colors: {
      primary:      "#529cca",
      primaryLight: "#1e3a5f",
      primaryDark:  "#88c0f0",
      primaryFg:    "#1e3a5f",
    },
    surfaces: {
      bg:          "#191919",
      toolbarBg:   "#202020",
      border:      "rgba(255,255,255,0.08)",
      text:        "#e6e6e6",
      textMuted:   "#787774",
      hover:       "rgba(255,255,255,0.05)",
      activeBg:    "rgba(82,156,202,0.15)",
      activeText:  "#88c0f0",
    },
    scrollbar: { thumb: "rgba(255,255,255,0.15)", hover: "rgba(255,255,255,0.25)" },
    typography: {
      font:       "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      monoFont:   "SFMono-Regular, 'SF Mono', Consolas, monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },
    borders:  { radius: "0.375rem", radiusBtn: "0.25rem", width: "1px" },
    toolbar:  { size: "2rem",       iconSize: "0.875rem", compact: false },
    shadow:   "0 4px 24px rgba(0,0,0,0.5)",
  },

  // ── Midnight (Linear/Vercel-inspired) ───────────────────────────────────────
  "midnight-dark": {
    colorMode: "dark",
    colors: {
      primary:      "#818cf8",
      primaryLight: "#312e81",
      primaryDark:  "#c7d2fe",
      primaryFg:    "#1e1b4b",
    },
    surfaces: {
      bg:          "#0f0f14",
      toolbarBg:   "#13131a",
      border:      "rgba(129,140,248,0.15)",
      text:        "#e2e8f0",
      textMuted:   "#64748b",
      hover:       "rgba(129,140,248,0.08)",
      activeBg:    "rgba(129,140,248,0.15)",
      activeText:  "#a5b4fc",
    },
    scrollbar: { thumb: "rgba(129,140,248,0.2)", hover: "rgba(129,140,248,0.4)" },
    typography: {
      font:       "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      monoFont:   "'JetBrains Mono', 'Fira Code', monospace",
      fontSize:   "15px",
      lineHeight: "1.7",
    },
    borders:  { radius: "0.5rem",  radiusBtn: "0.375rem", width: "1px" },
    toolbar:  { size: "2rem",      iconSize: "0.9rem",    compact: false },
    shadow:   "0 4px 32px rgba(0,0,0,0.7)",
  },

  "midnight-light": {
    colorMode: "light",
    colors: {
      primary:      "#4f46e5",
      primaryLight: "#eef2ff",
      primaryDark:  "#3730a3",
      primaryFg:    "#ffffff",
    },
    surfaces: {
      bg:          "#fafafa",
      toolbarBg:   "#f5f5ff",
      border:      "#e0e7ff",
      text:        "#1e1b4b",
      textMuted:   "#6366f1",
      hover:       "#eef2ff",
      activeBg:    "#e0e7ff",
      activeText:  "#3730a3",
    },
    scrollbar: { thumb: "rgba(79,70,229,0.2)", hover: "rgba(79,70,229,0.4)" },
    typography: {
      font:       "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      monoFont:   "'JetBrains Mono', 'Fira Code', monospace",
      fontSize:   "15px",
      lineHeight: "1.7",
    },
    borders:  { radius: "0.5rem",  radiusBtn: "0.375rem", width: "1px" },
    toolbar:  { size: "2rem",      iconSize: "0.9rem",    compact: false },
    shadow:   "0 2px 16px rgba(79,70,229,0.1)",
  },

  // ── Forest (writing-focused) ─────────────────────────────────────────────────
  "forest-light": {
    colorMode: "light",
    colors: {
      primary:      "#16a34a",
      primaryLight: "#dcfce7",
      primaryDark:  "#14532d",
      primaryFg:    "#ffffff",
    },
    surfaces: {
      bg:          "#fafaf7",
      toolbarBg:   "#f2f5f0",
      border:      "#d4e6cc",
      text:        "#1c2b1a",
      textMuted:   "#6b7c69",
      hover:       "#e8f5e4",
      activeBg:    "#dcfce7",
      activeText:  "#14532d",
    },
    scrollbar: { thumb: "rgba(22,163,74,0.25)", hover: "rgba(22,163,74,0.45)" },
    typography: {
      font:       "Georgia, 'Times New Roman', serif",
      monoFont:   "'JetBrains Mono', Consolas, monospace",
      fontSize:   "17px",
      lineHeight: "1.85",
    },
    borders:  { radius: "0.5rem",  radiusBtn: "0.25rem", width: "1px" },
    toolbar:  { size: "2rem",      iconSize: "0.9rem",   compact: false },
    shadow:   "0 2px 12px rgba(0,0,0,0.06)",
  },

  "forest-dark": {
    colorMode: "dark",
    colors: {
      primary:      "#4ade80",
      primaryLight: "#14532d",
      primaryDark:  "#86efac",
      primaryFg:    "#052e16",
    },
    surfaces: {
      bg:          "#0f1a0f",
      toolbarBg:   "#111f11",
      border:      "rgba(74,222,128,0.12)",
      text:        "#ecfdf0",
      textMuted:   "#4b7a52",
      hover:       "rgba(74,222,128,0.07)",
      activeBg:    "rgba(74,222,128,0.12)",
      activeText:  "#86efac",
    },
    scrollbar: { thumb: "rgba(74,222,128,0.2)", hover: "rgba(74,222,128,0.35)" },
    typography: {
      font:       "Georgia, 'Times New Roman', serif",
      monoFont:   "'JetBrains Mono', Consolas, monospace",
      fontSize:   "17px",
      lineHeight: "1.85",
    },
    borders:  { radius: "0.5rem",  radiusBtn: "0.25rem", width: "1px" },
    toolbar:  { size: "2rem",      iconSize: "0.9rem",   compact: false },
    shadow:   "0 4px 24px rgba(0,0,0,0.6)",
  },

  // ── Terminal ─────────────────────────────────────────────────────────────────
  "terminal-dark": {
    colorMode: "dark",
    colors: {
      primary:      "#22c55e",
      primaryLight: "#052e16",
      primaryDark:  "#86efac",
      primaryFg:    "#000000",
    },
    surfaces: {
      bg:          "#0a0a0a",
      toolbarBg:   "#000000",
      border:      "rgba(34,197,94,0.2)",
      text:        "#22c55e",
      textMuted:   "#166534",
      hover:       "rgba(34,197,94,0.08)",
      activeBg:    "rgba(34,197,94,0.15)",
      activeText:  "#86efac",
    },
    scrollbar: { thumb: "rgba(34,197,94,0.25)", hover: "rgba(34,197,94,0.45)" },
    typography: {
      font:       "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      monoFont:   "'JetBrains Mono', 'Courier New', monospace",
      fontSize:   "14px",
      lineHeight: "1.65",
    },
    borders:  { radius: "2px",     radiusBtn: "2px",     width: "1px" },
    toolbar:  { size: "1.875rem",  iconSize: "0.85rem",  compact: true },
    shadow:   "0 0 0 1px rgba(34,197,94,0.15), 0 4px 24px rgba(0,0,0,0.8)",
  },

  // ── Aurora (design-tool-inspired) ────────────────────────────────────────────
  "aurora-dark": {
    colorMode: "dark",
    colors: {
      primary:      "#2dd4bf",
      primaryLight: "#0d3d38",
      primaryDark:  "#99f6e4",
      primaryFg:    "#042f2e",
    },
    surfaces: {
      bg:          "#0c0f14",
      toolbarBg:   "#0f1318",
      border:      "rgba(45,212,191,0.12)",
      text:        "#e2fffb",
      textMuted:   "#4b8a83",
      hover:       "rgba(45,212,191,0.07)",
      activeBg:    "rgba(45,212,191,0.12)",
      activeText:  "#99f6e4",
    },
    scrollbar: { thumb: "rgba(45,212,191,0.2)", hover: "rgba(45,212,191,0.4)" },
    typography: {
      font:       "Inter, -apple-system, sans-serif",
      monoFont:   "'JetBrains Mono', monospace",
      fontSize:   "15px",
      lineHeight: "1.7",
    },
    borders:  { radius: "0.625rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar:  { size: "2.125rem",   iconSize: "0.9rem",    compact: false },
    shadow:   "0 4px 32px rgba(0,0,0,0.7)",
  },

  // ── Newsprint (editorial) ────────────────────────────────────────────────────
  "newsprint-light": {
    colorMode: "light",
    colors: {
      primary:      "#dc2626",
      primaryLight: "#fee2e2",
      primaryDark:  "#991b1b",
      primaryFg:    "#ffffff",
    },
    surfaces: {
      bg:          "#faf9f7",
      toolbarBg:   "#f0ede8",
      border:      "#d4cfc9",
      text:        "#1a1108",
      textMuted:   "#78716c",
      hover:       "#e8e3db",
      activeBg:    "#fee2e2",
      activeText:  "#991b1b",
    },
    scrollbar: { thumb: "rgba(220,38,38,0.2)", hover: "rgba(220,38,38,0.4)" },
    typography: {
      font:       "'Georgia', 'Palatino Linotype', serif",
      monoFont:   "Courier, 'Courier New', monospace",
      fontSize:   "17px",
      lineHeight: "1.9",
    },
    borders:  { radius: "0",    radiusBtn: "0",    width: "2px" },
    toolbar:  { size: "2rem",   iconSize: "0.9rem", compact: false },
    shadow:   "none",
  },

  // ── Social (Facebook/LinkedIn composer-inspired) ─────────────────────────────
  "social-light": {
    colorMode: "light",
    colors: {
      primary:      "#1877f2",
      primaryLight: "#e7f0fd",
      primaryDark:  "#0d6efd",
      primaryFg:    "#ffffff",
    },
    surfaces: {
      bg:          "#ffffff",
      toolbarBg:   "#f0f2f5",
      border:      "#dde1e7",
      text:        "#1c1e21",
      textMuted:   "#8a8d91",
      hover:       "#e4e6eb",
      activeBg:    "#e7f0fd",
      activeText:  "#0d6efd",
    },
    scrollbar: { thumb: "rgba(24,119,242,0.2)", hover: "rgba(24,119,242,0.4)" },
    typography: {
      font:       "Helvetica, Arial, sans-serif",
      monoFont:   "monospace",
      fontSize:   "15px",
      lineHeight: "1.6",
    },
    borders:  { radius: "0.75rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar:  { size: "2rem",      iconSize: "0.875rem",  compact: false },
    shadow:   "0 2px 8px rgba(0,0,0,0.08)",
  },
}

// ── Resolver ──────────────────────────────────────────────────────────────────
// Merges a named theme with any uiConfig overrides and returns
// the complete CSS variable map + runtime flags.

export function resolveTheme(uiConfig = {}) {
  const presetName = uiConfig.preset || "base-light"
  const base       = NAMED_THEMES[presetName] || NAMED_THEMES["base-light"]

  // Allow per-key overrides from uiConfig
  const colors     = { ...base.colors,     ...(uiConfig.colors     || {}) }
  const surfaces   = { ...base.surfaces,   ...(uiConfig.surfaces   || {}) }
  const scrollbar  = { ...base.scrollbar,  ...(uiConfig.scrollbar  || {}) }
  const typography = { ...base.typography, ...(uiConfig.typography || {}) }
  const borders    = { ...base.borders,    ...(uiConfig.borders    || {}) }
  const toolbar    = { ...base.toolbar,    ...(uiConfig.toolbar    || {}) }
  const shadow     = uiConfig.shadow ?? base.shadow
  const colorMode  = uiConfig.colorMode ?? base.colorMode

  return {
    colorMode,   // "light" | "dark" — used to set data-ne-theme attribute
    compact: toolbar.compact,
    cssVars: {
      // Accent colours
      "--ne-primary":        colors.primary,
      "--ne-primary-light":  colors.primaryLight,
      "--ne-primary-dark":   colors.primaryDark,
      "--ne-primary-fg":     colors.primaryFg,
      // Surfaces — all injected directly so no theme bleeds through
      "--ne-bg":             surfaces.bg,
      "--ne-toolbar-bg":     surfaces.toolbarBg,
      "--ne-border":         surfaces.border,
      "--ne-text":           surfaces.text,
      "--ne-text-muted":     surfaces.textMuted,
      "--ne-hover":          surfaces.hover,
      "--ne-active-bg":      surfaces.activeBg,
      "--ne-active-text":    surfaces.activeText,
      // Scrollbar
      "--ne-scrollbar-thumb": scrollbar.thumb,
      "--ne-scrollbar-hover": scrollbar.hover,
      // Typography
      "--ne-font":           typography.font,
      "--ne-mono-font":      typography.monoFont,
      "--ne-font-size":      typography.fontSize,
      "--ne-line-height":    typography.lineHeight,
      // Structure
      "--ne-radius":         borders.radius,
      "--ne-radius-btn":     borders.radiusBtn,
      "--ne-border-width":   borders.width,
      "--ne-toolbar-size":   toolbar.size,
      "--ne-icon-size":      toolbar.iconSize,
      "--ne-shadow":         shadow,
      "--ne-scrollbar-track": "transparent",
    },
  }
}
