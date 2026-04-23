# Nova Editor Usage Guide

This guide covers every way to use Nova Editor: auto-init via data attributes, manual JS init, React component usage, and Django form integration.

---

## 1. Add the files

After running `npm run build:standalone`, copy the two output files from `dist-standalone/` into your project's static directory:

```txt
nova-editor.umd.js
nova-editor.css
```

Then include them in your HTML `<head>`:

```html
<link rel="stylesheet" href="/static/nova-editor/nova-editor.css">
<script src="/static/nova-editor/nova-editor.umd.js" defer></script>
```

---

## 2. Auto-init with data attributes

The simplest approach. Add a `div` with `data-nova-editor` and the editor mounts automatically on page load.

```html
<div
  id="my-editor"
  data-nova-editor
  data-toolbar="full"
  data-color-mode="dark"
  data-glass="true"
  data-placeholder="Write something…"
></div>
```

### All supported data attributes

| Attribute              | Values                             | Default            | Description                                       |
|------------------------|------------------------------------|--------------------|---------------------------------------------------|
| `data-nova-editor`     | (presence flag)                    | —                  | Triggers auto-init                                |
| `data-ui-preset`       | `valiux` `clean` `utility` `soft`  | `valiux`           | Visual theme                                      |
| `data-toolbar`         | `minimal` `standard` `full`        | `full`             | Which toolbar buttons to show                     |
| `data-color-mode`      | `light` `dark` `system`            | `dark`             | Color scheme                                      |
| `data-glass`           | `true` `false`                     | `true`             | Glassmorphism effect                              |
| `data-compact`         | `true` `false`                     | `false`            | Tighter toolbar padding                           |
| `data-placeholder`     | any string                         | `"Start writing…"` | Placeholder text                                  |
| `data-show-word-count` | `true` `false`                     | `true`             | Show word/character count                         |
| `data-sticky-toolbar`  | `true` `false`                     | `true`             | Toolbar sticks to top on scroll                   |
| `data-max-height`      | number (px)                        | —                  | Cap editor height; content scrolls                |
| `data-auto-focus`      | `true` `false`                     | `false`            | Focus editor on mount                             |
| `data-output-format`   | `html` `slate`                     | `html`             | Output format for the `onChange` callback         |
| `data-hidden-input`    | element id                         | —                  | ID of `<input>` or `<textarea>` to sync HTML into |
| `data-branding-name`   | any string                         | —                  | Brand name shown in toolbar                       |
| `data-branding-logo`   | URL                                | —                  | Logo URL shown in toolbar                         |
| `data-ui-config`       | JSON string                        | —                  | Full `uiConfig` override (see section 4)          |

---

## 3. Manual JavaScript init

For full control, call `NovaEditor.init()` in a `<script>` block after the editor div.

```html
<div id="editor"></div>

<script>
const editor = NovaEditor.init({
  elementId:     "editor",
  toolbar:       "full",
  colorMode:     "dark",
  glass:         true,
  placeholder:   "Start writing…",
  showWordCount: true,
  stickyToolbar: true,

  // Called every time content changes — receives the HTML string
  onHTMLChange(html) {
    console.log(html)
  },
})

// Imperative API
editor.getHTML()          // returns current HTML string
editor.setHTML("<p>Hi</p>")  // replaces content
editor.destroy()          // unmounts React tree
</script>
```

---

## 4. UI theming

Control every visual detail via `uiConfig`:

```js
NovaEditor.init({
  elementId: "editor",
  uiConfig: {
    preset: "valiux",         // base theme to start from
    glass:  true,             // glassmorphism (dark mode recommended)

    colors: {
      primary:      "#f59e0b",   // main accent — buttons, borders, highlights
      primaryLight: "#fde68a",   // lighter shade
      primaryDark:  "#b45309",   // darker shade
      primaryFg:    "#1c1008",   // text on primary background
    },

    typography: {
      font:       "'Syne', sans-serif",
      monoFont:   "'JetBrains Mono', monospace",
      fontSize:   "16px",
      lineHeight: "1.75",
    },

    borders: {
      radius:    "0.75rem",  // outer container corner radius
      radiusBtn: "0.375rem", // toolbar button corner radius
      width:     "1px",      // border thickness
    },

    toolbar: {
      size:     "2.25rem",   // button height/width
      iconSize: "1rem",      // icon dimensions
      compact:  false,       // reduce toolbar padding
    },

    shadow: "0 4px 24px rgba(0,0,0,0.1)",
  },
})
```

To use an existing named theme with just one override, you can do:

```js
uiConfig: {
  preset: "clean",
  borders: { radius: "0", radiusBtn: "0" },  // make it sharp-cornered
}
```

---

## 5. Custom toolbar

Pass a custom `toolbarConfig` to choose exactly which buttons appear. Use `NovaEditor.createToolbarConfig()` as a shorthand:

```js
// Only include specific groups
const myToolbar = NovaEditor.createToolbarConfig(["formatting", "headings", "actions"])

NovaEditor.init({
  elementId:    "editor",
  toolbarConfig: myToolbar,
})
```

Or build the object manually for full control:

```js
NovaEditor.init({
  elementId: "editor",
  toolbarConfig: {
    formatting: ["bold", "italic", "underline"],
    headings:   ["heading-one", "heading-two", "paragraph"],
    blocks:     ["bulleted-list", "numbered-list"],
    alignment:  [],
    actions:    ["undo", "redo"],
    fullscreen: ["fullscreen"],
  },
})
```

---

## 6. Django integration

### Basic form field

The recommended pattern: put a hidden `<textarea>` with your field name, and let Nova Editor sync into it on every change.

```html
{% load static %}
<link rel="stylesheet" href="{% static 'nova-editor/nova-editor.css' %}">
<script src="{% static 'nova-editor/nova-editor.umd.js' %}" defer></script>

<form method="post">
  {% csrf_token %}

  <!-- Hidden textarea submits with the form -->
  <textarea id="body-field" name="body" style="display:none">{{ form.body.value|default:'' }}</textarea>

  <!-- Editor mounts here, syncs HTML into the textarea above -->
  <div
    id="body-editor"
    data-nova-editor
    data-hidden-input="body-field"
    data-toolbar="full"
    data-color-mode="dark"
    data-initial-html="{{ form.body.value|default:''|escapejs }}"
  ></div>

  <button type="submit">Save</button>
</form>
```

### Loading existing content

Pass existing HTML back in via `data-initial-html` (auto-init) or `initialHTML` (JS init):

```html
<!-- Auto-init -->
<div
  id="editor"
  data-nova-editor
  data-initial-html="{{ object.body|escapejs }}"
  data-hidden-input="body-field"
></div>

<!-- JS init -->
<script>
NovaEditor.init({
  elementId:   "editor",
  initialHTML: "{{ object.body|escapejs }}",
  hiddenInputId: "body-field",
})
</script>
```

### With Alpine.js

If you're using Alpine.js and want to react to editor content:

```html
<div x-data="{ body: '{{ object.body|escapejs }}' }">
  <input type="hidden" id="body-field" x-model="body" />
  <div
    id="editor"
    data-nova-editor
    data-hidden-input="body-field"
    data-initial-html="{{ object.body|escapejs }}"
  ></div>
  <!-- body is now reactive and stays in sync -->
</div>
```

### Django form widget approach

If you want a clean Python-side widget:

```python
# widgets.py
from django import forms

class NovaEditorWidget(forms.Textarea):
    def __init__(self, *args, toolbar="full", color_mode="dark", **kwargs):
        super().__init__(*args, **kwargs)
        self.toolbar    = toolbar
        self.color_mode = color_mode

    def build_attrs(self, base_attrs, extra_attrs=None):
        attrs = super().build_attrs(base_attrs, extra_attrs)
        attrs["style"] = "display:none"
        return attrs

    def render(self, name, value, attrs=None, renderer=None):
        textarea_html = super().render(name, value, attrs, renderer)
        final_id      = attrs.get("id", f"id_{name}")
        editor_html = f"""
        <div
          id="{final_id}_editor"
          data-nova-editor
          data-hidden-input="{final_id}"
          data-toolbar="{self.toolbar}"
          data-color-mode="{self.color_mode}"
          data-initial-html="{(value or '').replace(chr(34), '&quot;')}"
        ></div>
        """
        return textarea_html + editor_html

# forms.py / admin.py
class ArticleForm(forms.ModelForm):
    class Meta:
        model   = Article
        fields  = ["title", "body"]
        widgets = {"body": NovaEditorWidget(toolbar="full", color_mode="dark")}
```

---

## 7. Theme toggle (light ↔ dark)

Nova Editor supports live theme toggling by re-initialising with the current HTML:

```js
let mode   = "dark"
let editor = NovaEditor.init({ elementId: "editor", colorMode: mode })

document.getElementById("theme-btn").addEventListener("click", () => {
  const html = editor.getHTML()
  editor.destroy()
  mode   = mode === "dark" ? "light" : "dark"
  editor = NovaEditor.init({ elementId: "editor", colorMode: mode, initialHTML: html })
})
```

If your site already has a `data-theme` attribute on `<html>` and you use CSS variables for theming, you can also pass `colorMode: "system"` and let the editor follow the OS preference automatically without any JS.

---

## 8. Markdown paste

When you paste Markdown text into the editor, it is automatically converted. Supported syntax:

| Markdown | Result |
|---|---|
| `# Heading` | H1 |
| `## Heading` | H2 |
| `### Heading` | H3 |
| `**bold**` | Bold |
| `*italic*` or `_italic_` | Italic |
| `` `code` `` | Inline code |
| `~~strike~~` | Strikethrough |
| `> quote` | Blockquote |
| `- item` or `* item` | Bullet list |
| `1. item` | Numbered list |
| `- [ ] task` | Unchecked task |
| `- [x] task` | Checked task |
| `---` | Horizontal divider |
| ` ```lang ` | Code block |
| `\| col \| col \|` table | Table |

---

## Testing checklist

After each implementation, run through:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build:standalone` completes and outputs to `dist-standalone/`
- [ ] Opening `dist-standalone/index.html` in browser shows the playground
- [ ] Editor mounts and accepts input
- [ ] Toolbar buttons respond and toggle correctly
- [ ] Pasting Markdown produces correct formatting
- [ ] `data-hidden-input` syncs HTML on change
- [ ] Fullscreen toggle (F11 / toolbar button) works
- [ ] Sticky toolbar stays visible on scroll (when `stickyToolbar=true`, no `maxHeight`)
- [ ] Max height clips content and scrolls within the editor
- [ ] Scrollbar is styled (thin, amber-tinted)
- [ ] All four UI themes render correctly
- [ ] Light/dark/system color mode switches work
- [ ] Glass effect applies on dark mode
- [ ] Outer radius and button radius overrides take effect
- [ ] Branding strip shows logo + name when enabled
