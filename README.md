# Nova Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.4.0-blue.svg)](https://github.com/brandnova/nova-editor/releases)
[![Built with React](https://img.shields.io/badge/built%20with-React%2018-61dafb.svg?logo=react)](https://react.dev)
[![Slate.js](https://img.shields.io/badge/editor-Slate.js-black.svg)](https://slatejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/brandnova/nova-editor?style=social)](https://github.com/brandnova/nova-editor/stargazers)

A configurable, themeable rich text editor for the web, built with React and Slate.js.
Drop-in ready for Django templates, plain HTML, PHP, or any project that can include a JS/CSS file.

---

## Features

- **Neutral base theme** with paired light/dark named presets — `base`, `valiux`, `notion`, `midnight`, `forest`, `aurora`, `newsprint`, `social`, `terminal`
- **Three toolbar presets**: `minimal`, `standard`, `full` — or build a custom config
- **Responsive single-row toolbar** — all tool groups are trigger buttons that open slide-down sub-toolbars. No overflow, no wrapping, no JavaScript measurement
- **Full UI configurability** — border radius, toolbar size, compact mode, fonts, shadows, all surface colours
- **Light / Dark / System** color mode baked into named themes
- **Markdown paste** — headings, lists, tables, code blocks, checklists, bold/italic/strikethrough
- **HTML ↔ Slate serialisation** — outputs clean indented HTML; accepts HTML as initial content
- **Rich formatting tools** — Bold, Italic, Underline, Strikethrough, Inline Code, Subscript, Superscript, Clear Formatting
- **Typography tools** — Font Family selector, Font Size selector (10px–64px)
- **Colour tools** — Text Colour and Highlight Colour with 48-swatch palette + hex input
- **Link insertion** — href, display text, and new-tab toggle via popover
- **Image insertion** — URL-based with alt text
- **Special characters** — categorised grid of symbols
- **Emoji picker** — categorised with search
- **Hidden input sync** — wire directly to a `<textarea>` or `<input>` for form submission
- **Footer branding** — optional logo + name with click-to-collapse animation
- **Fullscreen mode** — CSS-based, no native API, works in all contexts
- **Sticky toolbar** — stays visible on scroll; sub-toolbars stick with it
- **Max height + internal scroll** — cap editor height with styled scrollbar
- **Accessible** — keyboard navigation, ARIA roles, focus rings, shortcut labels
- **Standalone build** — one JS + one CSS file, no React required on the page

---

## Presets

### UI Themes (`uiConfig.preset`)
| Name              | Mode  | Appearance                                    |
|-------------------|-------|-----------------------------------------------|
| `base-light`      | Light | Neutral, no colour personality                |
| `base-dark`       | Dark  | Neutral dark                                  |
| `valiux-dark`     | Dark  | Amber on deep dark (Brand Nova identity)      |
| `valiux-light`    | Light | Amber light variant                           |
| `notion-light`    | Light | Blue accent, document-first, system font      |
| `notion-dark`     | Dark  | Blue accent dark                              |
| `midnight-dark`   | Dark  | Indigo accent, Linear/Vercel-inspired         |
| `midnight-light`  | Light | Indigo light variant                          |
| `forest-light`    | Light | Green accent, serif font, writing-focused     |
| `forest-dark`     | Dark  | Green accent dark                             |
| `aurora-dark`     | Dark  | Teal accent, design-tool-inspired             |
| `newsprint-light` | Light | Red accent, editorial serif, square corners   |
| `social-light`    | Light | Blue accent, rounded, composer-inspired       |
| `terminal-dark`   | Dark  | Phosphor green, monospace everything          |

### Toolbar Presets (`preset` prop)
| Name       | Groups included                                                      |
|------------|----------------------------------------------------------------------|
| `minimal`  | Formatting (Bold/Italic/Underline), Headings (H1/¶), Actions        |
| `standard` | + Strikethrough, Clear, H2/H3, Lists, Blockquote                    |
| `full`     | All groups including Alignment, Blocks, Insert (link/image/emoji)   |

---

## Installation

```bash
npm install
npm run dev          # dev server
npm run build        # production React build
npm run build:standalone   # standalone JS + CSS
```

---

## Usage

Full usage documentation: [USAGE.md](USAGE.md)

Quick example for plain HTML:

```html
<!-- 1. Include the standalone build -->
<link rel="stylesheet" href="path/to/nova-editor.css">
<script src="path/to/nova-editor.umd.js" defer></script>

<!-- 2. Add a mount point -->
<div
  id="my-editor"
  data-nova-editor
  data-toolbar="full"
  data-ui-preset="notion-light"
  data-placeholder="Start writing…"
></div>

<!-- 3. Read the output -->
<script>
  const editor = NovaEditor.init({
    elementId:    "my-editor",
    toolbar:      "full",
    uiPreset:     "notion-light",
    onHTMLChange: (html) => console.log(html),
  })
</script>
```

---

## File Structure

```
src/
├── components/NovaEditor/
│   ├── NovaEditor.jsx       # Main editor — state, hotkeys, renderers
│   ├── Toolbar.jsx          # All group trigger buttons + sub-toolbar wiring
│   ├── SubToolbar.jsx       # Slide-down sub-toolbar panel component
│   ├── useToolbarCollapse.js # Toolbar ref (simplified — no measurement needed)
│   ├── serializers.js       # HTML ↔ Slate + pretty-printer
│   ├── markdown.js          # Markdown paste parser
│   ├── index.js             # Re-exports
│   └── tools/
│       ├── ColourPicker.jsx    # Reusable colour picker with palette + hex input
│       ├── FontFamilySelect.jsx
│       ├── FontSizeSelect.jsx
│       ├── LinkTool.jsx        # Link insertion popover
│       ├── ImageTool.jsx       # Image URL insertion
│       ├── SpecialChars.jsx    # Special characters grid
│       └── EmojiPicker.jsx     # Emoji picker with search
├── theme-config.js          # Named themes + CSS variable resolver
├── presets.js               # Toolbar preset definitions
├── standalone.js            # window.NovaEditor bundle entry
├── App.jsx                  # Dev playground
└── index.css                # All editor styles

public/
├── index.html               # Standalone demo / GitHub Pages landing
└── logo.png
```

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to report bugs, propose new themes, add toolbar tools, or improve documentation.

For significant changes, open an issue first to discuss what you'd like to change.

---

## License

MIT License © 2026 **Brand Nova**.  
For full legal terms and ownership details, see the [LICENSE](LICENSE) file.
