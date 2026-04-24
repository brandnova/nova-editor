import React from "react"
import { createRoot } from "react-dom/client"
import NovaEditor from "./components/NovaEditor"
import "./index.css"

const DEFAULT_OPTIONS = {
  elementId:     "nova-editor",
  initialHTML:   "",
  uiPreset:      "valiux",   // visual theme preset name
  toolbar:       "full",     // toolbar button set: "minimal"|"standard"|"full"
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
  branding:      null,
  uiConfig:      {},
  toolbarConfig: null,
  onChange:      null,
  onHTMLChange:  null,
}

window.NovaEditor = {
  init(options = {}) {
    const cfg = { ...DEFAULT_OPTIONS, ...options }

    const element = document.getElementById(cfg.elementId)
    if (!element) {
      console.error(`[NovaEditor] Element #${cfg.elementId} not found`)
      return null
    }

    const EditorWrapper = () =>
      React.createElement(NovaEditor, {
        initialHTML:   cfg.initialHTML,
        // toolbar preset → the NovaEditor component prop is called `preset`
        preset:        cfg.toolbar,
        toolbarConfig: cfg.toolbarConfig || null,
        uiConfig: {
          preset:  cfg.uiPreset,
          glass:   cfg.glass,
          compact: cfg.compact,
          ...cfg.uiConfig,
        },
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
    groups.forEach(g => { if (all[g]) config[g] = all[g] })
    return config
  },
}

// ── Auto-init ──────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-nova-editor]").forEach(el => {
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
      uiPreset:      d.uiPreset     || "valiux",
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
