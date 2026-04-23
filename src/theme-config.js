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
  /**
   * Valiux default: Amber on deep dark with glass morphism.
   */
  valiux: {
    colorMode: "dark",
    glass: true,
    colors: {
      primary:       "#f59e0b",
      primaryLight:  "#fde68a",
      primaryDark:   "#b45309",
      primaryFg:     "#1c1008",
    },
    typography: {
      font: "'Syne', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSize: "16px",
      lineHeight: "1.75",
    },
    borders: {
      radius: "0.75rem",
      radiusBtn: "0.375rem",
      width: "1px",
    },
    toolbar: {
      size: "2.25rem",
      iconSize: "1rem",
      compact: false,
    },
    shadow: "0 4px 32px rgba(0,0,0,0.5)",
  },

  /**
   * Clean light theme — suitable for client-facing apps.
   */
  clean: {
    colorMode: "light",
    glass: false,
    colors: {
      primary:       "#f59e0b",
      primaryLight:  "#fef3c7",
      primaryDark:   "#92400e",
      primaryFg:     "#ffffff",
    },
    typography: {
      font: "'Syne', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSize: "16px",
      lineHeight: "1.75",
    },
    borders: {
      radius: "0.5rem",
      radiusBtn: "0.25rem",
      width: "1px",
    },
    toolbar: {
      size: "2rem",
      iconSize: "0.9rem",
      compact: false,
    },
    shadow: "0 2px 16px rgba(255, 255, 255, 0.06)",
  },

  /**
   * Compact utility mode — tight toolbar, no shadow, square corners.
   */
  utility: {
    colorMode: "light",
    glass: false,
    colors: {
      primary:       "#f59e0b",
      primaryLight:  "#fef3c7",
      primaryDark:   "#92400e",
      primaryFg:     "#ffffff",
    },
    typography: {
      font: "system-ui, sans-serif",
      monoFont: "monospace",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    borders: {
      radius: "0",
      radiusBtn: "0",
      width: "1px",
    },
    toolbar: {
      size: "1.75rem",
      iconSize: "0.8rem",
      compact: true,
    },
    shadow: "none",
  },

  /**
   * Rounded soft mode — pill buttons, generous radius.
   */
  soft: {
    colorMode: "light",
    glass: false,
    colors: {
      primary:       "#f59e0b",
      primaryLight:  "#fde68a",
      primaryDark:   "#b45309",
      primaryFg:     "#1c1008",
    },
    typography: {
      font: "'Syne', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSize: "16px",
      lineHeight: "1.8",
    },
    borders: {
      radius: "1.25rem",
      radiusBtn: "999px",
      width: "1.5px",
    },
    toolbar: {
      size: "2.25rem",
      iconSize: "1rem",
      compact: false,
    },
    shadow: "0 8px 32px rgba(245,158,11,0.12)",
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
