/**
 * Toolbar presets — controls which tool groups and buttons appear.
 *
 * You can pass either a preset name ("minimal" | "standard" | "full")
 * or a custom toolbarConfig object to NovaEditor.
 */

export const TOOLBAR_PRESETS = {
  minimal: {
    formatting: ["bold", "italic", "underline"],
    headings:   ["heading-one", "paragraph"],
    blocks:     [],
    alignment:  [],
    actions:    ["undo", "redo"],
    fullscreen: ["fullscreen"],
  },

  standard: {
    formatting: ["bold", "italic", "underline", "strikethrough"],
    headings:   ["heading-one", "heading-two", "heading-three", "paragraph"],
    blocks:     ["bulleted-list", "numbered-list", "block-quote"],
    alignment:  [],
    actions:    ["undo", "redo"],
    fullscreen: ["fullscreen"],
  },

  full: {
    formatting: ["bold", "italic", "underline", "strikethrough", "code"],
    headings:   ["heading-one", "heading-two", "heading-three", "paragraph"],
    blocks:     ["bulleted-list", "numbered-list", "block-quote", "code-block", "horizontal-rule"],
    alignment:  ["left", "center", "right", "justify"],
    actions:    ["undo", "redo"],
    fullscreen: ["fullscreen"],
  },
}

/** Resolve a preset name or custom config into a toolbarConfig object */
export function resolveToolbarConfig(preset = "full", customConfig = null) {
  if (customConfig) return customConfig
  return TOOLBAR_PRESETS[preset] || TOOLBAR_PRESETS.full
}
