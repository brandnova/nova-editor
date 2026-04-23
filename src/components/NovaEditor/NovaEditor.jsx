import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { createEditor, Transforms, Editor, Element as SlateElement, Text } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import { withHistory } from "slate-history"
import isHotkey from "is-hotkey"
import Toolbar from "./Toolbar"
import { serializeToHTML, parseHTMLToSlate } from "./serializers"
import { parseMarkdown } from "./markdown"
import { resolveTheme } from "../../theme-config"
import { resolveToolbarConfig } from "../../presets"

// ── Hotkeys ───────────────────────────────────────────────────────────────────

const HOTKEYS = {
  "mod+b":       "bold",
  "mod+i":       "italic",
  "mod+u":       "underline",
  "mod+`":       "code",
  "mod+shift+s": "strikethrough",
  "mod+z":       "undo",
  "mod+shift+z": "redo",
  "mod+y":       "redo",
  "f11":         "fullscreen",
}

const LIST_TYPES        = ["numbered-list", "bulleted-list"]
const TEXT_ALIGN_TYPES  = ["left", "center", "right", "justify"]

// Markdown paste is triggered when any of these patterns are detected
const MD_SIGNALS = ["# ", "## ", "### ", "**", "~~", "```", "> ", "- ", "---", "___", "***", "|"]

// ── Main component ────────────────────────────────────────────────────────────

const NovaEditor = ({
  // Content
  initialValue  = null,
  initialHTML   = "",
  placeholder   = "Start writing…",

  // Output
  outputFormat  = "html",       // "html" | "slate"
  onChange      = null,         // (slateNodes) => void
  onHTMLChange  = null,         // (htmlString) => void
  hiddenInputId = null,         // sync HTML to a <input type="hidden"> or <textarea>

  // Toolbar preset
  preset        = "full",       // "minimal" | "standard" | "full"
  toolbarConfig = null,         // custom toolbarConfig overrides preset

  // Theme / UI
  uiConfig      = {},
  colorMode     = null,         // "light" | "dark" | "system" — overrides uiConfig.colorMode
  glass         = null,         // boolean — overrides uiConfig.glass

  // Features
  showWordCount   = true,
  stickyToolbar   = true,
  maxHeight       = null,       // number (px) — makes content area scroll internally
  autoFocus       = false,

  // Branding
  branding  = null,             // { logo?: string, name?: string } | null

  className = "",
}) => {

  // ── Theme resolution ─────────────────────────────────────────────────────

  const resolved = useMemo(() => resolveTheme({
    ...uiConfig,
    ...(colorMode !== null ? { colorMode } : {}),
    ...(glass     !== null ? { glass }     : {}),
  }), [uiConfig, colorMode, glass])

  // System color scheme listener
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  )
  useEffect(() => {
    if (resolved.colorMode !== "system") return
    const mq      = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e) => setSystemDark(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [resolved.colorMode])

  const isDark = resolved.colorMode === "dark"
    || (resolved.colorMode === "system" && systemDark)

  // ── Toolbar config ────────────────────────────────────────────────────────

  const effectiveToolbarConfig = useMemo(
    () => resolveToolbarConfig(preset, toolbarConfig),
    [preset, toolbarConfig]
  )

  // ── Initial Slate value ───────────────────────────────────────────────────

  const getInitial = () => {
    if (initialHTML?.trim()) return parseHTMLToSlate(initialHTML)
    if (initialValue)        return initialValue
    return [{ type: "paragraph", children: [{ text: "" }] }]
  }

  const [value,       setValue]       = useState(getInitial)
  const [wordCount,   setWordCount]   = useState(0)
  const [charCount,   setCharCount]   = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const rootRef = useRef(null)

  // ── Slate editor instance ─────────────────────────────────────────────────

  const editor = useMemo(() => {
    const e = withHistory(withReact(createEditor()))
    const { isVoid, normalizeNode } = e

    e.isVoid = (el) => el.type === "horizontal-rule" ? true : isVoid(el)

    e.normalizeNode = ([node, path]) => {
      if (SlateElement.isElement(node) && node.type === "table-cell") {
        if (node.children.length === 0) {
          Transforms.insertNodes(e, { text: "" }, { at: [...path, 0] })
          return
        }
      }
      normalizeNode([node, path])
    }

    return e
  }, [])

  // ── Fullscreen ────────────────────────────────────────────────────────────

  const toggleFullscreen = useCallback(async () => {
    if (!rootRef.current) return
    try {
      if (!document.fullscreenElement) {
        await rootRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Fallback: toggle class-based fullscreen
      setIsFullscreen((v) => !v)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  // ── Renderers ─────────────────────────────────────────────────────────────

  const renderElement = useCallback(
    (props) => <Element {...props} isDark={isDark} />,
    [isDark]
  )
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  // ── Change handler ────────────────────────────────────────────────────────

  const handleChange = useCallback((newValue) => {
    setValue(newValue)

    // Word / character count
    const plain = newValue
      .map((n) =>
        SlateElement.isElement(n)
          ? n.children.map((c) => (Text.isText(c) ? c.text : "")).join("")
          : ""
      )
      .join(" ")
    setWordCount(plain.trim() ? plain.trim().split(/\s+/).length : 0)
    setCharCount(plain.length)

    // HTML output
    const html = serializeToHTML(newValue)

    // Sync to hidden input / textarea (supports Django forms, Alpine, vanilla)
    if (hiddenInputId) {
      const el = document.getElementById(hiddenInputId)
      if (el) {
        el.value = html
        el.dispatchEvent(new Event("change", { bubbles: true }))
        el.dispatchEvent(new Event("input",  { bubbles: true }))
      }
    }

    if (outputFormat === "html" && onHTMLChange) onHTMLChange(html)
    if (onChange) onChange(newValue)
  }, [onHTMLChange, onChange, outputFormat, hiddenInputId])

  // ── Keyboard handler ──────────────────────────────────────────────────────

  const handleKeyDown = useCallback((event) => {
    // Check registered hotkeys first
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault()
        const action = HOTKEYS[hotkey]
        if      (action === "undo")       editor.undo()
        else if (action === "redo")       editor.redo()
        else if (action === "fullscreen") toggleFullscreen()
        else                              toggleMark(editor, action)
        return
      }
    }

    // Auto-reset heading → paragraph on Enter
    if (event.key === "Enter") {
      const { selection } = editor
      if (!selection) return
      const [match] = Array.from(Editor.nodes(editor, {
        match: (n) =>
          SlateElement.isElement(n) &&
          ["heading-one", "heading-two", "heading-three"].includes(n.type),
      }))
      if (match) {
        event.preventDefault()
        editor.insertBreak()
        Transforms.setNodes(editor, { type: "paragraph" })
      }
    }
  }, [editor, toggleFullscreen])

  // ── Markdown paste ────────────────────────────────────────────────────────

  const handlePaste = useCallback((event) => {
    const text = event.clipboardData.getData("text/plain")
    const isMarkdown =
      MD_SIGNALS.some((sig) => text.includes(sig)) ||
      /^\d+\. /m.test(text)

    if (isMarkdown) {
      event.preventDefault()
      Transforms.insertNodes(editor, parseMarkdown(text))
    }
  }, [editor])

  // ── Public imperative API (exposed on DOM element) ────────────────────────

  const getHTML = useCallback(() => serializeToHTML(value), [value])
  const getSlateValue = useCallback(() => value, [value])
  const setHTML = useCallback((html) => {
    const nodes = parseHTMLToSlate(html)
    editor.children = nodes
    Editor.normalize(editor, { force: true })
    setValue(nodes)
  }, [editor])

  useEffect(() => {
    if (!rootRef.current) return
    rootRef.current.__novaEditor = { getHTML, getSlateValue, setHTML }
  }, [getHTML, getSlateValue, setHTML])

  // ── CSS classes ───────────────────────────────────────────────────────────

  // The sticky toolbar class goes on ne-root (the outer wrapper), not the
  // container. The .ne-sticky-toolbar .ne-toolbar rule in CSS then makes the
  // toolbar sticky within the page scroll context — which only works when
  // the container does NOT have overflow:hidden (i.e. no maxHeight set).
  // When maxHeight IS set, the toolbar naturally stays at the top of the
  // flex column, so stickiness isn't needed.
  const useStickyClass  = stickyToolbar && !maxHeight && !isFullscreen

  const rootClass = [
    "ne-root",
    resolved.glass  ? "ne-glass"           : "",
    useStickyClass  ? "ne-sticky-toolbar"  : "",
    isFullscreen    ? "ne-fullscreen-wrap" : "",
    className,
  ].filter(Boolean).join(" ")

  const containerClass = [
    "ne-container",
    maxHeight ? "has-max-height" : "",
  ].filter(Boolean).join(" ")

  // Container height style — set only when maxHeight or fullscreen
  const containerStyle = isFullscreen
    ? { height: "100%", maxHeight: "100%" }
    : maxHeight
      ? { height: `${maxHeight}px`, maxHeight: `${maxHeight}px` }
      : {}

  return (
    <div
      ref={rootRef}
      className={rootClass}
      data-ne-theme={isDark ? "dark" : "light"}
      style={resolved.cssVars}
    >
      <div className={containerClass} style={containerStyle}>
        <Slate editor={editor} initialValue={value} onValueChange={handleChange}>

          {/* Toolbar */}
          <Toolbar
            toolbarConfig={effectiveToolbarConfig}
            isFullscreen={isFullscreen}
            compact={resolved.compact}
            onToggleFullscreen={toggleFullscreen}
            branding={branding}
          />

          {/* Editable area */}
          <div
            className="ne-content"
            role="textbox"
            aria-multiline="true"
            aria-label="Rich text editor"
            style={{
              minHeight: maxHeight || isFullscreen ? undefined : "320px",
              fontSize:   resolved.cssVars["--ne-font-size"]  || "16px",
              lineHeight: resolved.cssVars["--ne-line-height"] || "1.75",
            }}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              spellCheck
              autoFocus={autoFocus}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              style={{ minHeight: "inherit", outline: "none" }}
            />
          </div>

          {/* Footer: word count */}
          {showWordCount && (
            <div className="ne-footer" aria-live="polite" id="ne-word-count">
              <span className="ne-footer-stat">{wordCount} words</span>
              <span className="ne-footer-stat">{charCount} chars</span>
              {isFullscreen && (
                <span className="ne-footer-fullscreen-badge">Fullscreen</span>
              )}
            </div>
          )}

        </Slate>
      </div>
    </div>
  )
}

// ── Element renderer ──────────────────────────────────────────────────────────

const Element = ({ attributes, children, element }) => {
  const style = element.align ? { textAlign: element.align } : {}

  switch (element.type) {
    case "heading-one":   return <h1   style={style} {...attributes}>{children}</h1>
    case "heading-two":   return <h2   style={style} {...attributes}>{children}</h2>
    case "heading-three": return <h3   style={style} {...attributes}>{children}</h3>
    case "block-quote":   return <blockquote style={style} {...attributes}>{children}</blockquote>
    case "bulleted-list": return <ul   style={style} {...attributes}>{children}</ul>
    case "numbered-list": return <ol   style={style} {...attributes}>{children}</ol>
    case "list-item":     return <li   style={style} {...attributes}>{children}</li>

    case "check-item":
      return (
        <div {...attributes} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", ...style }}>
          <input
            type="checkbox"
            checked={!!element.checked}
            readOnly
            style={{ marginTop: "0.3rem", accentColor: "var(--ne-primary)", flexShrink: 0 }}
          />
          <span style={{ textDecoration: element.checked ? "line-through" : "none", opacity: element.checked ? 0.5 : 1 }}>
            {children}
          </span>
        </div>
      )

    case "code-block":
      return (
        <pre {...attributes}>
          <code className={`language-${element.language || "text"}`}>{children}</code>
        </pre>
      )

    case "horizontal-rule":
      return (
        <div {...attributes} contentEditable={false} style={{ userSelect: "none" }}>
          <hr />
          {children}
        </div>
      )

    // ── Table — correct Slate-native rendering ──────────────────────────────
    // Each level renders only {children} — Slate calls renderElement recursively
    // for each child node. Never manually map element.children here.
    case "table":
      return (
        <div className="ne-table-wrapper">
          <table {...attributes}>
            {children}
          </table>
        </div>
      )

    case "table-header":
      // Renders as <thead><tr> — children are table-cell nodes with header:true
      return (
        <thead {...attributes}>
          <tr>{children}</tr>
        </thead>
      )

    case "table-body":
      return <tbody {...attributes}>{children}</tbody>

    case "table-row":
      return <tr {...attributes}>{children}</tr>

    case "table-cell":
      // The markdown parser sets header:true on cells inside a table-header node
      return element.header
        ? <th {...attributes} style={style}>{children}</th>
        : <td {...attributes} style={style}>{children}</td>

    default:
      return <p style={style} {...attributes}>{children}</p>
  }
}

// ── Leaf renderer ─────────────────────────────────────────────────────────────

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold)          children = <strong>{children}</strong>
  if (leaf.italic)        children = <em>{children}</em>
  if (leaf.underline)     children = <u>{children}</u>
  if (leaf.strikethrough) children = <del>{children}</del>
  if (leaf.code)          children = <code>{children}</code>
  return <span {...attributes}>{children}</span>
}

// ── Slate helpers (exported for Toolbar and external use) ─────────────────────

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor, format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  const newProps = TEXT_ALIGN_TYPES.includes(format)
    ? { align: isActive ? undefined : format }
    : { type: isActive ? "paragraph" : isList ? "list-item" : format }

  Transforms.setNodes(editor, newProps)

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] })
  }
}

export const toggleMark = (editor, format) => {
  if (isMarkActive(editor, format)) Editor.removeMark(editor, format)
  else                               Editor.addMark(editor, format, true)
}

export const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor
  if (!selection) return false
  const [match] = Array.from(Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
  }))
  return !!match
}

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export { serializeToHTML, parseHTMLToSlate }
export default NovaEditor
