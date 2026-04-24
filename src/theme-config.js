/**
 * Nova Editor – Theme Configuration System
 *
 * This is the single source of truth for theming. Pass a `uiConfig` object
 * to NovaEditor (or window.NovaEditor.init) to override any of these values.
 *
 * The full schema is documented here. You can also use one of the built-in
 * named themes via `uiConfig.theme = "valiux" | "clean" | "minimal-dark"`.
 */

// ── Built-in named themes ─────────────────────────────────────────────────────

export const NAMED_THEMES = {

  // ── Existing themes ──────────────────────────────────────────────────────

  /**
   * valiux — Amber on deep dark, glassmorphism.
   * Good for: creative tools, dark-mode-first apps, personal brands.
   */
  valiux: {
    colorMode: "dark", glass: true,
    colors: { primary: "#f59e0b", primaryLight: "#fde68a", primaryDark: "#b45309", primaryFg: "#1c1008" },
    typography: { font: "'Syne', sans-serif", monoFont: "'JetBrains Mono', monospace", fontSize: "16px", lineHeight: "1.75" },
    borders: { radius: "0.75rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar: { size: "2.25rem", iconSize: "1rem", compact: false },
    shadow: "0 4px 32px rgba(0,0,0,0.5)",
  },

  /**
   * clean — Light, minimal amber accents.
   * Good for: standard CMS fields, admin panels, straightforward content editing.
   */
  clean: {
    colorMode: "light", glass: false,
    colors: { primary: "#f59e0b", primaryLight: "#fef3c7", primaryDark: "#92400e", primaryFg: "#ffffff" },
    typography: { font: "'Syne', sans-serif", monoFont: "'JetBrains Mono', monospace", fontSize: "16px", lineHeight: "1.75" },
    borders: { radius: "0.5rem", radiusBtn: "0.25rem", width: "1px" },
    toolbar: { size: "2rem", iconSize: "0.9rem", compact: false },
    shadow: "0 2px 16px rgba(0,0,0,0.06)",
  },

  /**
   * utility — No radius, compact, system font.
   * Good for: dense admin dashboards, form builders, dev tools.
   */
  utility: {
    colorMode: "light", glass: false,
    colors: { primary: "#f59e0b", primaryLight: "#fef3c7", primaryDark: "#92400e", primaryFg: "#ffffff" },
    typography: { font: "system-ui, sans-serif", monoFont: "monospace", fontSize: "14px", lineHeight: "1.6" },
    borders: { radius: "0", radiusBtn: "0", width: "1px" },
    toolbar: { size: "1.75rem", iconSize: "0.8rem", compact: true },
    shadow: "none",
  },

  /**
   * soft — Pill buttons, generous radius.
   * Good for: consumer apps, social features, friendly UI.
   */
  soft: {
    colorMode: "light", glass: false,
    colors: { primary: "#f59e0b", primaryLight: "#fde68a", primaryDark: "#b45309", primaryFg: "#1c1008" },
    typography: { font: "'Syne', sans-serif", monoFont: "'JetBrains Mono', monospace", fontSize: "16px", lineHeight: "1.8" },
    borders: { radius: "1.25rem", radiusBtn: "999px", width: "1.5px" },
    toolbar: { size: "2.25rem", iconSize: "1rem", compact: false },
    shadow: "0 8px 32px rgba(245,158,11,0.12)",
  },

  // ── New themes ───────────────────────────────────────────────────────────

  /**
   * notion — Document-first, ultra-clean white, minimal chrome.
   * Inspired by: Notion, Linear, Craft.
   * Good for: note-taking apps, wikis, documentation platforms,
   *           any app where the content is the UI.
   */
  notion: {
    colorMode: "light", glass: false,
    colors: {
      primary:      "#2383e2",   // Notion's blue
      primaryLight: "#e8f3fe",
      primaryDark:  "#1565c0",
      primaryFg:    "#ffffff",
    },
    typography: {
      font:       "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      monoFont:   "SFMono-Regular, 'SF Mono', Consolas, monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },
    borders: { radius: "0.375rem", radiusBtn: "0.25rem", width: "1px" },
    toolbar: { size: "2rem", iconSize: "0.875rem", compact: false },
    shadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  },

  /**
   * midnight — Deep navy, indigo/violet accents, subtle glow.
   * Inspired by: Linear, Vercel, Discord.
   * Good for: developer tools, SaaS dashboards, dark-mode-first products.
   */
  midnight: {
    colorMode: "dark", glass: false,
    colors: {
      primary:      "#818cf8",   // indigo-400
      primaryLight: "#c7d2fe",
      primaryDark:  "#4f46e5",
      primaryFg:    "#1e1b4b",
    },
    typography: {
      font:       "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      monoFont:   "'JetBrains Mono', 'Fira Code', monospace",
      fontSize:   "15px",
      lineHeight: "1.7",
    },
    borders: { radius: "0.5rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar: { size: "2rem", iconSize: "0.9rem", compact: false },
    shadow: "0 4px 24px rgba(0,0,0,0.6)",
  },

  /**
   * forest — Earthy green primary, warm cream background.
   * Inspired by: Bear, Ulysses, iA Writer.
   * Good for: writing-focused apps, journaling, long-form content platforms.
   */
  forest: {
    colorMode: "light", glass: false,
    colors: {
      primary:      "#16a34a",   // green-600
      primaryLight: "#dcfce7",
      primaryDark:  "#14532d",
      primaryFg:    "#ffffff",
    },
    typography: {
      font:       "Georgia, 'Times New Roman', serif",
      monoFont:   "'JetBrains Mono', Consolas, monospace",
      fontSize:   "17px",
      lineHeight: "1.85",
    },
    borders: { radius: "0.5rem", radiusBtn: "0.25rem", width: "1px" },
    toolbar: { size: "2rem", iconSize: "0.9rem", compact: false },
    shadow: "0 2px 12px rgba(0,0,0,0.06)",
  },

  /**
   * newsprint — High contrast, editorial serif typography.
   * Inspired by: Medium, Substack, newspaper CMSes.
   * Good for: publishing platforms, blog editors, editorial tools.
   */
  newsprint: {
    colorMode: "light", glass: false,
    colors: {
      primary:      "#dc2626",   // red-600 — editorial red
      primaryLight: "#fee2e2",
      primaryDark:  "#991b1b",
      primaryFg:    "#ffffff",
    },
    typography: {
      font:       "'Georgia', 'Palatino Linotype', serif",
      monoFont:   "Courier, 'Courier New', monospace",
      fontSize:   "17px",
      lineHeight: "1.9",
    },
    borders: { radius: "0", radiusBtn: "0", width: "2px" },
    toolbar: { size: "2rem", iconSize: "0.9rem", compact: false },
    shadow: "none",
  },

  /**
   * terminal — Pure black, phosphor green, monospace everything.
   * Inspired by: VS Code terminal, Hyper, hacker aesthetics.
   * Good for: developer blogs, code-heavy documentation, CLI-adjacent tools.
   */
  terminal: {
    colorMode: "dark", glass: false,
    colors: {
      primary:      "#22c55e",   // green-500 phosphor
      primaryLight: "#bbf7d0",
      primaryDark:  "#15803d",
      primaryFg:    "#000000",
    },
    typography: {
      font:       "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      monoFont:   "'JetBrains Mono', 'Courier New', monospace",
      fontSize:   "14px",
      lineHeight: "1.65",
    },
    borders: { radius: "2px", radiusBtn: "2px", width: "1px" },
    toolbar: { size: "1.875rem", iconSize: "0.85rem", compact: true },
    shadow: "0 0 0 1px rgba(34,197,94,0.15), 0 4px 24px rgba(0,0,0,0.8)",
  },

  /**
   * social — Rounded, blue primary, Facebook/Twitter post-composer feel.
   * Inspired by: Facebook composer, LinkedIn post editor.
   * Good for: social features, comment boxes, user-generated content fields.
   */
  social: {
    colorMode: "light", glass: false,
    colors: {
      primary:      "#1877f2",   // Facebook blue
      primaryLight: "#e7f0fd",
      primaryDark:  "#0d6efd",
      primaryFg:    "#ffffff",
    },
    typography: {
      font:       "Helvetica, Arial, sans-serif",
      monoFont:   "monospace",
      fontSize:   "15px",
      lineHeight: "1.6",
    },
    borders: { radius: "0.75rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar: { size: "2rem", iconSize: "0.875rem", compact: false },
    shadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  /**
   * aurora — Teal/cyan on very dark, subtle gradient feel.
   * Inspired by: Figma, Framer, modern design tools.
   * Good for: design tools, creative platforms, portfolio editors.
   */
  aurora: {
    colorMode: "dark", glass: true,
    colors: {
      primary:      "#2dd4bf",   // teal-400
      primaryLight: "#99f6e4",
      primaryDark:  "#0f766e",
      primaryFg:    "#042f2e",
    },
    typography: {
      font:       "Inter, -apple-system, sans-serif",
      monoFont:   "'JetBrains Mono', monospace",
      fontSize:   "15px",
      lineHeight: "1.7",
    },
    borders: { radius: "0.625rem", radiusBtn: "0.375rem", width: "1px" },
    toolbar: { size: "2.125rem", iconSize: "0.9rem", compact: false },
    shadow: "0 4px 32px rgba(0,0,0,0.6)",
  },
}

// ── Default uiConfig (resolved before rendering) ─────────────────────────────

export const DEFAULT_UI_CONFIG = {
  /**
   * Named theme to start from. One of: "valiux" | "clean" | "utility" | "soft".
   * All other uiConfig keys OVERRIDE the named theme.
   */
  preset: "valiux",

  /** "light" | "dark" | "system" */
  colorMode: null, // null = use preset's colorMode

  /** Apply glass morphism effect (dark mode recommended) */
  glass: null,

  /**
   * Color overrides. All optional — unset keys fall back to the named theme.
   * {
   *   primary, primaryLight, primaryDark, primaryFg
   * }
   */
  colors: {},

  /**
   * Typography overrides.
   * { font, monoFont, fontSize, lineHeight }
   */
  typography: {},

  /**
   * Border overrides.
   * { radius, radiusBtn, width }
   *   radius    — outer container corner radius
   *   radiusBtn — toolbar button corner radius
   *   width     — border width
   */
  borders: {},

  /**
   * Toolbar overrides.
   * { size, iconSize, compact }
   *   size     — button height/width (e.g. "2.25rem")
   *   iconSize — icon dimensions
   *   compact  — boolean, reduces padding
   */
  toolbar: {},

  /** Box shadow string or "none" */
  shadow: null,
}

// ── Resolver: merges named theme + user overrides into CSS variable map ───────

export function resolveTheme(uiConfig = {}) {
  const base = NAMED_THEMES[uiConfig.preset || "valiux"] || NAMED_THEMES.valiux

  const colors     = { ...base.colors,     ...(uiConfig.colors     || {}) }
  const typography = { ...base.typography, ...(uiConfig.typography || {}) }
  const borders    = { ...base.borders,    ...(uiConfig.borders    || {}) }
  const toolbar    = { ...base.toolbar,    ...(uiConfig.toolbar    || {}) }

  const colorMode = uiConfig.colorMode ?? base.colorMode
  const glass     = uiConfig.glass     ?? base.glass
  const shadow    = uiConfig.shadow    ?? base.shadow

  return {
    colorMode, // "light" | "dark" | "system"
    glass,
    compact: toolbar.compact,
    cssVars: {
      "--ne-primary":       colors.primary,
      "--ne-primary-light": colors.primaryLight,
      "--ne-primary-dark":  colors.primaryDark,
      "--ne-primary-fg":    colors.primaryFg,
      "--ne-font":          typography.font,
      "--ne-mono-font":     typography.monoFont,
      "--ne-font-size":     typography.fontSize,
      "--ne-line-height":   typography.lineHeight,
      "--ne-radius":        borders.radius,
      "--ne-radius-btn":    borders.radiusBtn,
      "--ne-border-width":  borders.width,
      "--ne-toolbar-size":  toolbar.size,
      "--ne-icon-size":     toolbar.iconSize,
      "--ne-shadow":        shadow,
    },
  }
}
