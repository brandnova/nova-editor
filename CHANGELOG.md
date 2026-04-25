# Changelog

All notable changes to Nova Editor are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

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
