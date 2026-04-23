import React from "react"
import { createRoot } from "react-dom/client"
import NovaEditor from "./components/NovaEditor"
import "./index.css"

const DEFAULT_OPTIONS = {
  elementId:     "nova-editor",
  initialHTML:   "",
  preset:        "valiux",           // named UI theme
  toolbar:       "full",             // toolbar preset
  colorMode:     "dark",
  glass:         true,
  compact:       false,
  placeholder:   "Start writing…",
  showWordCount: true,
  stickyToolbar: true,
  maxHeight:     null,
  autoFocus:     false,
  outputFormat:  "html",
  hiddenInputId: null,
  branding:      null,               // { logo, name } or null
  uiConfig:      {},                 // arbitrary theme overrides
  onChange:      null,
  onHTMLChange:  null,
}

window.NovaEditor = {
  /**
   * Mount the editor.
   *
   * @param {object} options — see DEFAULT_OPTIONS above
   * @returns {{ destroy, getHTML, setHTML, getElement }}
   */
  init(options = {}) {
    const cfg = { ...DEFAULT_OPTIONS, ...options }

    const element = document.getElementById(cfg.elementId)
    if (!element) {
      console.error(`[NovaEditor] Element #${cfg.elementId} not found`)
      return null
    }

    let editorRef = null

    const EditorWrapper = () =>
      React.createElement(NovaEditor, {
        ref: (r) => { editorRef = r },
        initialHTML:   cfg.initialHTML,
        preset:        cfg.preset,
        toolbarConfig: cfg.toolbarConfig || null,
        uiConfig:      { preset: cfg.preset, glass: cfg.glass, compact: cfg.compact, ...cfg.uiConfig },
        colorMode:     cfg.colorMode,
        glass:         cfg.glass,
        placeholder:   cfg.placeholder,
        showWordCount: cfg.showWordCount,
        stickyToolbar: cfg.stickyToolbar,
        maxHeight:     cfg.maxHeight,
        autoFocus:     cfg.autoFocus,
        outputFormat:  cfg.outputFormat,
        hiddenInputId: cfg.hiddenInputId,
        branding:      cfg.branding,
        onChange:      cfg.onChange,
        onHTMLChange:  cfg.onHTMLChange,
      })

    const root = createRoot(element)
    root.render(React.createElement(EditorWrapper))

    return {
      destroy:    () => root.unmount(),
      getElement: () => element,
      getHTML:    () => element.__novaEditor?.getHTML?.() ?? "",
      setHTML:    (html) => element.__novaEditor?.setHTML?.(html),
    }
  },

  /** Helper: build a toolbar config from group names */
  createToolbarConfig(groups = []) {
    const all = {
      formatting: ["bold","italic","underline","strikethrough","code"],
      headings:   ["heading-one","heading-two","heading-three","paragraph"],
      blocks:     ["bulleted-list","numbered-list","block-quote","code-block","horizontal-rule"],
      alignment:  ["left","center","right","justify"],
      actions:    ["undo","redo"],
      fullscreen: ["fullscreen"],
    }
    const config = {}
    groups.forEach((g) => { if (all[g]) config[g] = all[g] })
    return config
  },
}

// ── Auto-init via data attributes ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-nova-editor]").forEach((el) => {
    const d = el.dataset

    let uiConfig = {}
    if (d.uiConfig) {
      try { uiConfig = JSON.parse(d.uiConfig) } catch { /* ignore */ }
    }

    let branding = null
    if (d.brandingName || d.brandingLogo) {
      branding = { name: d.brandingName || "", logo: d.brandingLogo || "" }
    }

    window.NovaEditor.init({
      elementId:     el.id,
      initialHTML:   d.initialHtml  || "",
      preset:        d.uiPreset     || "valiux",
      toolbar:       d.toolbar      || "full",
      colorMode:     d.colorMode    || "dark",
      glass:         d.glass        !== "false",
      compact:       d.compact      === "true",
      placeholder:   d.placeholder  || "Start writing…",
      showWordCount: d.showWordCount !== "false",
      stickyToolbar: d.stickyToolbar !== "false",
      maxHeight:     d.maxHeight    ? parseInt(d.maxHeight) : null,
      autoFocus:     d.autoFocus    === "true",
      outputFormat:  d.outputFormat || "html",
      hiddenInputId: d.hiddenInput  || null,
      branding,
      uiConfig,
    })
  })
})
