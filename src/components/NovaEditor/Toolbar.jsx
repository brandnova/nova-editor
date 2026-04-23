import { useSlate } from "slate-react"
import { Transforms } from "slate"
import { useEffect, useRef, useState } from "react"
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3, Type,
  Quote, List, ListOrdered, Minus, Code2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Maximize, Minimize,
} from "lucide-react"
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from "./NovaEditor"

const TOOL_META = {
  bold:            { type: "mark",  Icon: Bold,          title: "Bold",          shortcut: "Ctrl+B" },
  italic:          { type: "mark",  Icon: Italic,        title: "Italic",        shortcut: "Ctrl+I" },
  underline:       { type: "mark",  Icon: Underline,     title: "Underline",     shortcut: "Ctrl+U" },
  strikethrough:   { type: "mark",  Icon: Strikethrough, title: "Strikethrough", shortcut: "Ctrl+Shift+S" },
  code:            { type: "mark",  Icon: Code,          title: "Inline Code",   shortcut: "Ctrl+`" },
  "heading-one":   { type: "block", Icon: Heading1, title: "Heading 1" },
  "heading-two":   { type: "block", Icon: Heading2, title: "Heading 2" },
  "heading-three": { type: "block", Icon: Heading3, title: "Heading 3" },
  paragraph:       { type: "action", Icon: Type,    title: "Paragraph", actionKey: "paragraph" },
  "block-quote":     { type: "block",  Icon: Quote,       title: "Blockquote" },
  "bulleted-list":   { type: "block",  Icon: List,        title: "Bullet List" },
  "numbered-list":   { type: "block",  Icon: ListOrdered, title: "Numbered List" },
  "code-block":      { type: "block",  Icon: Code2,       title: "Code Block" },
  "horizontal-rule": { type: "action", Icon: Minus,       title: "Divider", actionKey: "horizontal-rule" },
  left:    { type: "align", Icon: AlignLeft,    title: "Align Left" },
  center:  { type: "align", Icon: AlignCenter,  title: "Align Center" },
  right:   { type: "align", Icon: AlignRight,   title: "Align Right" },
  justify: { type: "align", Icon: AlignJustify, title: "Align Justify" },
}

const GROUP_ORDER = ["formatting", "headings", "blocks", "alignment", "actions", "fullscreen"]

// ── Branding component with collapse animation ────────────────────────────────

const BrandingStrip = ({ branding }) => {
  const [collapsed, setCollapsed] = useState(false)
  const timerRef = useRef(null)

  const hasLogo = !!branding.logo
  const hasName = !!branding.name

  // Collapse after 3 seconds if both logo and name are present
  useEffect(() => {
    if (!hasLogo || !hasName) return
    timerRef.current = setTimeout(() => setCollapsed(true), 3000)
    return () => clearTimeout(timerRef.current)
  }, [hasLogo, hasName])

  const handleLogoClick = () => {
    if (!collapsed) return
    setCollapsed(false)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCollapsed(true), 3000)
  }

  // If only name, only logo — render simply without animation
  if (!hasLogo || !hasName) {
    return (
      <div className="ne-brand">
        {hasLogo && <img src={branding.logo} alt={branding.name || "Brand logo"} />}
        {hasName && <span className="ne-brand-name">{branding.name}</span>}
      </div>
    )
  }

  // Both present — animated version
  return (
    <div className={`ne-brand${collapsed ? " collapsed" : ""}`}>
      <div
        className="ne-brand-logo-wrap"
        onClick={handleLogoClick}
        title={collapsed ? branding.name : undefined}
      >
        <img src={branding.logo} alt={branding.name} />
        {collapsed && (
          <span className="ne-brand-logo-tooltip">{branding.name}</span>
        )}
      </div>
      <span className="ne-brand-name">{branding.name}</span>
    </div>
  )
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

const Toolbar = ({
  toolbarConfig = {},
  isFullscreen  = false,
  compact       = false,
  onToggleFullscreen,
  branding,
}) => {
  const editor = useSlate()

  const isActive = (toolKey) => {
    const meta = TOOL_META[toolKey]
    if (!meta) return false
    if (meta.type === "mark")  return isMarkActive(editor, toolKey)
    if (meta.type === "block") return isBlockActive(editor, toolKey)
    if (meta.type === "align") return isBlockActive(editor, toolKey, "align")
    if (meta.type === "action" && meta.actionKey === "paragraph") return isBlockActive(editor, "paragraph")
    return false
  }

  const handleClick = (toolKey, event) => {
    event.preventDefault()
    const meta = TOOL_META[toolKey]
    if (!meta) return
    switch (meta.type) {
      case "mark":  toggleMark(editor, toolKey);  break
      case "block": toggleBlock(editor, toolKey); break
      case "align": toggleBlock(editor, toolKey); break
      case "action":
        if (meta.actionKey === "paragraph")      toggleBlock(editor, "paragraph")
        if (meta.actionKey === "horizontal-rule")
          Transforms.insertNodes(editor, { type: "horizontal-rule", children: [{ text: "" }] })
        break
    }
  }

  const renderGroup = (groupName) => {
    const tools = toolbarConfig[groupName]
    if (!tools || tools.length === 0) return null

    if (groupName === "actions") {
      const hasUndo = tools.includes("undo")
      const hasRedo = tools.includes("redo")
      if (!hasUndo && !hasRedo) return null
      return (
        <div className="ne-toolbar-group">
          {hasUndo && <Btn onMouseDown={e => { e.preventDefault(); editor.undo() }} title="Undo" shortcut="Ctrl+Z"><Undo /></Btn>}
          {hasRedo && <Btn onMouseDown={e => { e.preventDefault(); editor.redo() }} title="Redo" shortcut="Ctrl+Y"><Redo /></Btn>}
        </div>
      )
    }

    if (groupName === "fullscreen") {
      if (!tools.includes("fullscreen")) return null
      return (
        <div className="ne-toolbar-group" style={!branding ? { marginLeft: "auto" } : undefined}>
          <Btn
            onMouseDown={e => { e.preventDefault(); onToggleFullscreen?.() }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            shortcut="F11"
            active={isFullscreen}
          >
            {isFullscreen ? <Minimize /> : <Maximize />}
          </Btn>
        </div>
      )
    }

    const buttons = tools.map(toolKey => {
      const meta = TOOL_META[toolKey]
      if (!meta) return null
      const { Icon } = meta
      return (
        <Btn key={toolKey} onMouseDown={e => handleClick(toolKey, e)}
          title={meta.title} shortcut={meta.shortcut} active={isActive(toolKey)}>
          <Icon />
        </Btn>
      )
    }).filter(Boolean)

    if (buttons.length === 0) return null
    return <div className="ne-toolbar-group">{buttons}</div>
  }

  const renderedGroups = []
  GROUP_ORDER.forEach(groupName => {
    const el = renderGroup(groupName)
    if (!el) return
    if (renderedGroups.length > 0) {
      renderedGroups.push(<div key={`sep-${groupName}`} className="ne-toolbar-sep" aria-hidden="true" />)
    }
    renderedGroups.push(<div key={groupName}>{el}</div>)
  })

  return (
    <div className={`ne-toolbar${compact ? " compact" : ""}`} role="toolbar" aria-label="Text formatting toolbar">
      {renderedGroups}
      {branding && <BrandingStrip branding={branding} />}
    </div>
  )
}

const Btn = ({ active = false, title, shortcut, children, ...props }) => {
  const label = shortcut ? `${title} (${shortcut})` : title
  return (
    <button type="button" className={`ne-btn${active ? " active" : ""}`}
      aria-label={label} aria-pressed={active} tabIndex={0} {...props}>
      {children}
      <span className="ne-tooltip" role="tooltip">{label}</span>
    </button>
  )
}

export default Toolbar