# Changelog

All notable changes to Nova Editor are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.4.0] — 2026-04-27

### Added
- **Insert group** — new `insert` toolbar group with its own trigger button,
  containing Link, Image, Special Characters, and Emoji tools.
- **Link insertion** (`tools/LinkTool.jsx`) — inline form in the Insert
  sub-toolbar with href, optional display text, and new-tab toggle.
  Detects existing links and shows edit/remove controls. Renders as an
  inline Slate node; serialises to `<a href="..." target="...">`.
- **Image insertion** (`tools/ImageTool.jsx`) — URL + alt text form.
  Renders as a void block element; serialises to `<img src="..." alt="...">`.
  File upload reserved for a future version.
- **Special characters** (`tools/SpecialChars.jsx`) — categorised scrollable
  grid (Common, Punctuation, Currency, Arrows, Math, Latin). Inserts Unicode
  character directly at cursor via `insertText`.
- **Emoji picker** (`tools/EmojiPicker.jsx`) — categorised grid with category
  search. 8 categories, ~240 emojis. Inserts at cursor via `insertText`.
- `link` and `image` Slate element types added to `Element` renderer,
  `serializers.js`, and `parseHTMLToSlate`.

### Changed
- `presets.js` — `standard` preset now includes `["link", "image"]` in
  the insert group. `full` preset includes all four insert tools.
- `isVoid` in editor now includes `"image"` alongside `"horizontal-rule"`.

---

## [2.3.2] — 2026-04-26

### Changed
- **Toolbar architecture simplified** — the right cluster (undo/redo/fullscreen)
  is now a `⋮` group trigger button like all other groups, opening a sub-toolbar
  panel on click. This eliminates all dynamic width measurement and the
  ResizeObserver-based two-row detection entirely.
- **`useToolbarCollapse`** reduced to a single `useRef` return — no state,
  no effects, no measurement logic.
- **Removed** `.ne-toolbar-cluster`, `.ne-toolbar-collapsible`,
  `.ne-toolbar--two-row` and all associated CSS.
- **Settings slot** in the cluster sub-toolbar remains reserved for v2.5.0.

---

## [2.3.1] — 2026-04-26

### Fixed
- **Sub-toolbar hidden behind sticky toolbar** — the sticky target is now
  `.ne-toolbar-wrap` (which contains both the main bar and all sub-toolbar
  panels) rather than `.ne-toolbar` alone. Sub-toolbars now scroll with the
  toolbar as a unit and are always accessible when the toolbar is sticky.
- **Colour picker panel clipped by sub-toolbar** — `.ne-sub-toolbar--open`
  now sets `overflow: visible` so the absolutely positioned colour panel
  escapes the sub-toolbar bounds correctly.
- **Colour picker panel opening upward** — panel now opens downward with
  `z-index: 500`, clearing the sticky toolbar-wrap (`z-index: 20`).
- **Subscript + superscript stacking** — `toggleMark` now explicitly removes
  the opposing mark before applying either subscript or superscript.
- **Clear Formatting incomplete** — now iterates all text nodes in the full
  selection range to collect every mark key, rather than reading only from
  `Editor.marks()` at the cursor point.
- **Font select option contrast** — forced explicit `background` and `color`
  on `<option>` elements to override OS-level system dark theme rendering.

---

## [2.3.0] — 2026-04-26

### Added
- **Subscript** (`Ctrl+,`) — new mark, serialises to `<span style="vertical-align:sub">`.
- **Superscript** (`Ctrl+.`) — new mark, serialises to `<span style="vertical-align:super">`.
- **Clear Formatting** — removes all marks from the current selection.
- **Font Family selector** — dropdown in the Formatting sub-toolbar with 9 font options. Applies a `fontFamily` mark; serialises to `<span style="font-family:...">`.
- **Font Size selector** — dropdown with 13 size options (10px–64px). Applies a `fontSize` mark; serialises to `<span style="font-size:...">`.
- **Text Colour** — inline colour picker with 48-colour palette + hex input. Applies a `color` mark; serialises to `<span style="color:...">`.
- **Highlight Colour** — same picker for `background-color`. Applies a `backgroundColor` mark.
- `ColourPicker` component (`tools/ColourPicker.jsx`) — reusable for link/image tools in v2.4.0.
- `FontFamilySelect` component (`tools/FontFamilySelect.jsx`).
- `FontSizeSelect` component (`tools/FontSizeSelect.jsx`).

### Fixed
- **Two-row flash on first render** — `useToolbarCollapse` now defers initial measurement to `requestAnimationFrame`, eliminating the incorrect two-row state before layout is complete.

### Changed
- `presets.js` full preset now includes all new formatting tools in the `formatting` group.
- `Leaf` renderer updated to apply inline styles for colour, font, subscript, and superscript marks.
- `serializers.js` updated to serialise all new marks as inline `<span style="...">` elements.
- `HOTKEYS` map updated with `Ctrl+,` (subscript) and `Ctrl+.` (superscript).

---

## [2.2.1] — 2026-04-26

### Changed
- **Toolbar architecture** — replaced floating portal dropdowns with a slide-down sub-toolbar that renders inside `.ne-container`. This fixes theme var inheritance, fullscreen compatibility, and viewport overflow issues in one change.
- **Group order** — collapsible groups now appear left to right as: Formatting → Headings → Alignment → Blocks.
- **Fullscreen** — replaced native `requestFullscreen()` with CSS-based fullscreen (`.ne-is-fullscreen` fixed positioning). Eliminates portal rendering failures in fullscreen mode and gives full control over theme, z-index, and layout.
- **Collapse timing** — `useToolbarCollapse` now measures actual DOM widths of the collapsible section and cluster rather than estimating from group pixel costs. The cluster wraps to a second row only when it genuinely cannot fit alongside the trigger buttons.
- **Single open group** — only one sub-toolbar can be open at a time. Opening a different group closes the current one. Activating a tool closes the sub-toolbar.

### Fixed
- Dropdown panels overflowing the viewport on right-edge and narrow-screen scenarios.
- Multiple dropdowns opening simultaneously.
- Dropdown panel retaining white background in dark themes (portal escaped CSS var scope).
- Fullscreen mode hiding sub-toolbar panels (portals rendered behind the fullscreen layer).
- Group trigger buttons overlapping the right cluster before collapsing.

---

## [2.2.0] — 2026-04-26

### Added
- **Responsive collapsing toolbar** — tool groups collapse into single trigger buttons when the toolbar runs out of horizontal space. Collapse is driven by `ResizeObserver`, not CSS breakpoints, so it works correctly in sidebars, modals, and any embedded context.
- **Floating group dropdowns** — collapsed groups open a floating panel (portalled to `document.body`) containing all tools for that group, laid out in a wrapping grid.
- **Right cluster row** — the undo/redo/fullscreen cluster is pinned to the right and never collapses. On very narrow containers it breaks to a dedicated second row, right-aligned, with a top border separating it from the collapsible section.
- **Active group indicator** — a small dot appears on a collapsed group's trigger button when any tool in that group is currently active.
- **Settings slot reserved** — the right cluster has a reserved slot for the settings button (ships in v2.5.0).
- **`useToolbarCollapse` hook** — exported for reuse or customisation.
- **`ToolbarGroupDropdown` component** — exported for reuse in custom toolbar extensions.

### Changed
- `Toolbar.jsx` restructured into collapsible section + fixed cluster layout.
- `TOOL_META` and `Btn` are now named exports from `Toolbar.jsx` for use by future tool files.

---

## [2.1.0] — 2026-04-25

### Added
- **New theme architecture** — each named theme now owns its complete set of surface, colour, typography, and scrollbar tokens. No more cross-theme colour bleed.
- **Light/dark theme variants** — every theme now ships as a paired light/dark entry (e.g. `valiux-dark` / `valiux-light`, `notion-light` / `notion-dark`).
- **New named themes** — `base-light`, `base-dark` (neutral defaults), `midnight-light`, `midnight-dark`, `forest-light`, `forest-dark`, `aurora-dark`, `newsprint-light`, `social-light`, `terminal-dark`.
- **Footer branding** — branding (logo + name) moved from toolbar to footer. Footer renders whenever word count or branding is present.
- **Footer branding collapse** — clicking the logo when both logo and name are present toggles the name off/on with a smooth slide animation.
- **`surfaces` token group** — `resolveTheme()` now resolves `surfaces.*` keys into CSS variables (`--ne-bg`, `--ne-toolbar-bg`, `--ne-border`, etc.), making every surface fully theme-controlled.

### Changed
- **Theme resolver** — `uiConfig` now accepts a `surfaces` override object in addition to `colors`, `typography`, `borders`, `toolbar`.
- **Default theme** — editor default changed from `valiux` to `base-light` (neutral, no colour personality out of the box).
- **Toolbar** — branding strip removed from toolbar; toolbar is now strictly a tool container.
- **Playground** — `colorMode` control removed (now baked into the named theme). Glass toggle removed.
- **Version badge** updated to `v2.1.0`.

### Removed
- **Glassmorphism toggle** — glass effect is now a theme-level property, not a runtime toggle.
- **`[data-ne-theme="dark"]` CSS selector** — dark/light surface values are injected as inline vars; the global dark override no longer exists and cannot bleed amber values into non-amber themes.
- **Toolbar branding slot** — `BrandingStrip` component removed from `Toolbar.jsx`.

### Fixed
- Theme switching now fully replaces all surface colours, accent colours, fonts, and scrollbar colours. Switching from `valiux-dark` to `midnight-dark` no longer retains amber highlights.

---

## [2.0.0] — 2025-09-10

### Added
- Initial public release.
- Slate.js-based rich text editor with HTML ↔ Slate serialisation.
- Toolbar presets: `minimal`, `standard`, `full`.
- Named UI themes: `valiux`, `clean`, `utility`, `soft`, `notion`, `midnight`, `forest`, `newsprint`, `terminal`, `social`, `aurora`.
- Markdown paste support: headings, lists, tables, code blocks, checklists.
- Standalone build (`nova-editor.umd.js` + `nova-editor.css`).
- Auto-init via `data-nova-editor` attribute.
- `hiddenInputId` form sync for Django, Alpine.js, plain HTML forms.
- Fullscreen mode (native Fullscreen API + CSS fallback).
- Sticky toolbar with `--ne-sticky-top` offset for sticky navs.
- Max height mode with internal scrolling.
- Pretty-printed HTML output.
- GitHub Pages demo page.
- MIT License.
- `CONTRIBUTING.md`.
- `USAGE.md` with HTML, Django, Alpine.js, and widget integration examples.
