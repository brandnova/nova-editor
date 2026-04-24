# Contributing to Nova Editor

Thank you for your interest in contributing. Nova Editor is a focused, opinionated project — contributions are welcome as long as they align with the project's goals: a clean, configurable, drop-in rich text editor that stays easy to integrate and maintain.

---

## Before you start

- Check [open issues](https://github.com/brandnova/nova-editor/issues) to see if your idea or bug is already tracked.
- For significant changes (new features, architectural changes), open an issue first to discuss it before writing code.
- For small fixes (typos, minor bugs, docs), feel free to open a PR directly.

---

## Project setup

```bash
git clone https://github.com/brandnova/nova-editor.git
cd nova-editor
npm install
npm run dev        # start dev server at localhost:5173
```

Test the standalone build:

```bash
npm run build:standalone
# then open dist-standalone/index.html in your browser
```

---

## Project structure

```
src/
├── components/NovaEditor/
│   ├── NovaEditor.jsx     # Main component — editor state, hotkeys, renderers
│   ├── Toolbar.jsx        # Toolbar rendering + branding animation
│   ├── serializers.js     # HTML ↔ Slate conversion + HTML pretty-printer
│   ├── markdown.js        # Markdown paste parser
│   └── index.js           # Re-exports
├── theme-config.js        # Named themes + CSS variable resolver
├── presets.js             # Toolbar preset definitions
├── standalone.js          # window.NovaEditor bundle entry point
├── App.jsx                # Dev playground
└── index.css              # All editor CSS (uses CSS custom properties)

public/
├── index.html             # Standalone demo / GitHub Pages landing page
├── logo.png
├── NovaEditor-Meta-Display.png
└── LICENSE
```

---

## Contribution areas

### Bug fixes

- Reproduce the bug in the dev playground (`npm run dev`) and/or in the standalone build.
- Identify which file is responsible (most runtime bugs live in `NovaEditor.jsx`, `serializers.js`, or `markdown.js`).
- Fix it, test it manually, and note the fix in your PR description.

### New toolbar tools

1. Add an entry to `TOOL_META` in `Toolbar.jsx` with the tool's `type`, `Icon`, `title`, and optional `shortcut`.
2. Add the tool key to the relevant group in `TOOLBAR_PRESETS` in `presets.js`.
3. Handle the tool's action in `Toolbar.jsx`'s `handleClick`.
4. Add the corresponding Slate mark/block to the `Element` or `Leaf` renderer in `NovaEditor.jsx`.
5. Add HTML serialisation for the new node type in `serializers.js`.

### New themes

Add an entry to `NAMED_THEMES` in `theme-config.js`. Follow the existing shape — all five top-level keys (`colorMode`, `glass`, `colors`, `typography`, `borders`, `toolbar`, `shadow`) must be present. Add the new name to the `<select>` in `public/index.html` with a descriptive label.

### CSS changes

All editor styles live in `src/index.css` and use CSS custom properties (`--ne-*`). Avoid hardcoding colour values — use the variables. Avoid adding Tailwind utility classes to the editor itself (Tailwind is only used in the dev playground wrapper).

### Documentation

Docs live in `README.md` and `USAGE.md`. Keep examples concise and test any code snippet before submitting.

---

## Pull request guidelines

- Keep PRs focused — one feature or fix per PR.
- Describe what the change does and why in the PR description.
- Test in both the dev playground (`npm run dev`) and the standalone build (`npm run build:standalone` + open `dist-standalone/index.html`).
- If your change affects theming, test with at least two different named themes.
- If your change affects Markdown paste, test with a variety of inputs (headings, tables, code blocks).

---

## Code style

- **JavaScript**: ES modules, no semicolons in new files is fine (existing files vary — match the file you're editing).
- **React**: functional components only, hooks for state.
- **CSS**: BEM-ish class names with `ne-` prefix for editor classes, `pg-` for playground.
- **Comments**: explain *why*, not *what*. Avoid obvious comments.

---

## Reporting bugs

Open a GitHub issue with:
1. What you expected to happen
2. What actually happened
3. Steps to reproduce (paste input, config used, browser/OS)
4. Whether it occurs in the standalone build, the dev playground, or both

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
