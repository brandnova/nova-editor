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
    insert:     [],
    actions:    ["undo", "redo"],
    fullscreen: ["fullscreen"],
  },

  standard: {
    formatting: ["bold", "italic", "underline", "strikethrough", "clearFormatting"],
    headings:   ["heading-one", "heading-two", "heading-three", "paragraph"],
    blocks:     ["bulleted-list", "numbered-list", "block-quote"],
    alignment:  [],
    insert:     ["link", "image"],
    actions:    ["undo", "redo"],
    fullscreen: ["fullscreen"],
  },

  full: {
    formatting: [
      "bold", "italic", "underline", "strikethrough", "code",
      "subscript", "superscript",
      "fontFamily", "fontSize",
      "textColor", "bgColor",
      "clearFormatting",
    ],
    headings:   ["heading-one", "heading-two", "heading-three", "paragraph"],
    blocks:     ["bulleted-list", "numbered-list", "block-quote", "code-block", "horizontal-rule"],
    alignment:  ["left", "center", "right", "justify"],
    insert:     ["link", "image", "specialChars", "emoji"],
    actions:    ["undo", "redo"],
    fullscreen: ["fullscreen"],
  },
}

export function resolveToolbarConfig(preset = "full", customConfig = null) {
  if (customConfig) return customConfig
  return TOOLBAR_PRESETS[preset] || TOOLBAR_PRESETS.full
}
