import { useState, useCallback } from "react"
import { useSlate } from "slate-react"
import { Editor, Transforms, Text } from "slate"
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3, Type,
  Quote, List, ListOrdered, Minus, Code2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Maximize, Minimize,
  ChevronDown,
  Subscript, Superscript, RemoveFormatting,
  Palette, Highlighter, CaseSensitive, TextCursor,
} from "lucide-react"
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from "./NovaEditor"
import SubToolbar from "./SubToolbar"
import { useToolbarCollapse } from "./useToolbarCollapse"
import ColourPicker from "./tools/ColourPicker"
import FontFamilySelect from "./tools/FontFamilySelect"
import FontSizeSelect from "./tools/FontSizeSelect"

// ── Tool metadata ─────────────────────────────────────────────────────────────

export const TOOL_META = {
  // Basic marks
  bold:            { type: "mark",   Icon: Bold,              title: "Bold",              shortcut: "Ctrl+B" },
  italic:          { type: "mark",   Icon: Italic,            title: "Italic",            shortcut: "Ctrl+I" },
  underline:       { type: "mark",   Icon: Underline,         title: "Underline",         shortcut: "Ctrl+U" },
  strikethrough:   { type: "mark",   Icon: Strikethrough,     title: "Strikethrough",     shortcut: "Ctrl+Shift+S" },
  code:            { type: "mark",   Icon: Code,              title: "Inline Code",       shortcut: "Ctrl+`" },
  // New v2.3.0 marks
  subscript:       { type: "mark",   Icon: Subscript,         title: "Subscript",         shortcut: "Ctrl+," },
  superscript:     { type: "mark",   Icon: Superscript,       title: "Superscript",       shortcut: "Ctrl+." },
  // Special actions
  clearFormatting: { type: "action", Icon: RemoveFormatting,  title: "Clear Formatting",  actionKey: "clearFormatting" },
  fontFamily:      { type: "custom", Icon: CaseSensitive,     title: "Font Family" },
  fontSize:        { type: "custom", Icon: TextCursor,        title: "Font Size" },
  textColor:       { type: "custom", Icon: Palette,           title: "Text Colour" },
  bgColor:         { type: "custom", Icon: Highlighter,       title: "Highlight Colour" },
  // Headings
  "heading-one":   { type: "block",  Icon: Heading1,          title: "Heading 1" },
  "heading-two":   { type: "block",  Icon: Heading2,          title: "Heading 2" },
  "heading-three": { type: "block",  Icon: Heading3,          title: "Heading 3" },
  paragraph:       { type: "action", Icon: Type,              title: "Paragraph",         actionKey: "paragraph" },
  // Alignment
  left:    { type: "align", Icon: AlignLeft,    title: "Align Left" },
  center:  { type: "align", Icon: AlignCenter,  title: "Align Center" },
  right:   { type: "align", Icon: AlignRight,   title: "Align Right" },
  justify: { type: "align", Icon: AlignJustify, title: "Align Justify" },
  // Blocks
  "block-quote":     { type: "block",  Icon: Quote,       title: "Blockquote" },
  "bulleted-list":   { type: "block",  Icon: List,        title: "Bullet List" },
  "numbered-list":   { type: "block",  Icon: ListOrdered, title: "Numbered List" },
  "code-block":      { type: "block",  Icon: Code2,       title: "Code Block" },
  "horizontal-rule": { type: "action", Icon: Minus,       title: "Divider",   actionKey: "horizontal-rule" },
}

// Group definitions — order = left to right on toolbar
export const COLLAPSIBLE_GROUPS = [
  { key: "formatting", label: "Formatting", Icon: Bold     },
  { key: "headings",   label: "Headings",   Icon: Heading1 },
  { key: "alignment",  label: "Alignment",  Icon: AlignLeft },
  { key: "blocks",     label: "Blocks",     Icon: List     },
]

// ── Toolbar ───────────────────────────────────────────────────────────────────

const Toolbar = ({
  toolbarConfig      = {},
  isFullscreen       = false,
  compact            = false,
  onToggleFullscreen,
}) => {
  const editor            = useSlate()
  const { toolbarRef }    = useToolbarCollapse()
  const [openGroup, setOpenGroup] = useState(null)

  const toggleGroup = useCallback((key) => {
    setOpenGroup(prev => prev === key ? null : key)
  }, [])

  const closeGroup = useCallback(() => setOpenGroup(null), [])

  // ── Mark state helpers ──────────────────────────────────────────────────

  const getMarkValue = (mark) => {
    const marks = Editor.marks(editor)
    return marks ? (marks[mark] ?? null) : null
  }

  const isToolActive = (toolKey) => {
    const meta = TOOL_META[toolKey]
    if (!meta) return false
    if (meta.type === "mark")  return isMarkActive(editor, toolKey)
    if (meta.type === "block") return isBlockActive(editor, toolKey)
    if (meta.type === "align") return isBlockActive(editor, toolKey, "align")
    if (meta.type === "action" && meta.actionKey === "paragraph")
      return isBlockActive(editor, "paragraph")
    return false
  }

  const isGroupActive = (groupKey) => {
    const tools = toolbarConfig[groupKey]
    if (!tools) return false
    return tools.some(t => {
      if (t === "textColor")  return !!getMarkValue("color")
      if (t === "bgColor")    return !!getMarkValue("backgroundColor")
      if (t === "fontFamily") return !!getMarkValue("fontFamily")
      if (t === "fontSize")   return !!getMarkValue("fontSize")
      return isToolActive(t)
    })
  }

  // ── Tool actions ────────────────────────────────────────────────────────

  const handleToolClick = (toolKey, event) => {
    event.preventDefault()
    const meta = TOOL_META[toolKey]
    if (!meta) return
    switch (meta.type) {
      case "mark":  toggleMark(editor, toolKey);  break
      case "block": toggleBlock(editor, toolKey); break
      case "align": toggleBlock(editor, toolKey); break
      case "action":
        if (meta.actionKey === "paragraph")
          toggleBlock(editor, "paragraph")
        if (meta.actionKey === "horizontal-rule")
          Transforms.insertNodes(editor, { type: "horizontal-rule", children: [{ text: "" }] })
        if (meta.actionKey === "clearFormatting")
          clearAllFormatting(editor)
        break
    }
    closeGroup()
  }

  // ── Clear all marks from selection ────────────────────────────────────────────────

  const clearAllFormatting = (ed) => {
    const { selection } = ed
    if (!selection) return

    // Collect every mark key that appears anywhere in the selection
    const markKeys = new Set()

    // Walk all leaf nodes in the selection range
    for (const [node] of Editor.nodes(ed, {
      at:    selection,
      match: n => Text.isText(n),
    })) {
      Object.keys(node).forEach(key => {
        if (key !== "text") markKeys.add(key)
      })
    }

    // Remove them all in a single operation
    markKeys.forEach(key => Editor.removeMark(ed, key))
  }

  // ── Custom tool handlers ────────────────────────────────────────────────

  const handleColourChange = (mark, value) => {
    if (value) Editor.addMark(editor, mark, value)
    else       Editor.removeMark(editor, mark)
  }

  const handleFontFamily = (value) => {
    if (value) Editor.addMark(editor, "fontFamily", value)
    else       Editor.removeMark(editor, "fontFamily")
  }

  const handleFontSize = (value) => {
    if (value) Editor.addMark(editor, "fontSize", value)
    else       Editor.removeMark(editor, "fontSize")
  }

  // ── Render tools for a group ────────────────────────────────────────────

  const renderTools = (groupKey) => {
    const tools = toolbarConfig[groupKey]
    if (!tools || tools.length === 0) return null

    return tools.map(toolKey => {
      // ── Custom tools ──
      if (toolKey === "textColor") {
        return (
          <ColourPicker
            key="textColor"
            icon={<Palette />}
            title="Text Colour"
            value={getMarkValue("color")}
            onChange={val => handleColourChange("color", val)}
            allowClear
          />
        )
      }

      if (toolKey === "bgColor") {
        return (
          <ColourPicker
            key="bgColor"
            icon={<Highlighter />}
            title="Highlight Colour"
            value={getMarkValue("backgroundColor")}
            onChange={val => handleColourChange("backgroundColor", val)}
            allowClear
          />
        )
      }

      if (toolKey === "fontFamily") {
        return (
          <FontFamilySelect
            key="fontFamily"
            value={getMarkValue("fontFamily") || ""}
            onChange={handleFontFamily}
          />
        )
      }

      if (toolKey === "fontSize") {
        return (
          <FontSizeSelect
            key="fontSize"
            value={getMarkValue("fontSize") || ""}
            onChange={handleFontSize}
          />
        )
      }

      // ── Standard tools ──
      const meta = TOOL_META[toolKey]
      if (!meta) return null
      const { Icon } = meta
      return (
        <Btn
          key={toolKey}
          onMouseDown={e => handleToolClick(toolKey, e)}
          title={meta.title}
          shortcut={meta.shortcut}
          active={isToolActive(toolKey)}
        >
          <Icon />
        </Btn>
      )
    }).filter(Boolean)
  }

  // ── Group trigger buttons ───────────────────────────────────────────────

  const collapsibleSection = COLLAPSIBLE_GROUPS.map((group, idx) => {
    const tools = toolbarConfig[group.key]
    if (!tools || tools.length === 0) return null
    const isOpen = openGroup === group.key
    const active = isGroupActive(group.key)
    const { Icon } = group

    return (
      <div key={group.key} style={{ display:"flex", alignItems:"center", gap:"0.125rem" }}>
        {idx > 0 && <div className="ne-toolbar-sep" aria-hidden="true" />}
        <button
          type="button"
          className={`ne-btn ne-group-trigger${isOpen ? " open" : ""}${active ? " active" : ""}`}
          onMouseDown={e => { e.preventDefault(); toggleGroup(group.key) }}
          aria-label={group.label}
          aria-expanded={isOpen}
          aria-haspopup="true"
          title={group.label}
        >
          <Icon />
          <ChevronDown className="ne-group-trigger-chevron" />
          {active && !isOpen && <span className="ne-group-trigger-dot" aria-hidden="true" />}
        </button>
      </div>
    )
  }).filter(Boolean)

  // ── Right cluster ───────────────────────────────────────────────────────

  const actionTools     = toolbarConfig["actions"]    || []
  const fullscreenTools = toolbarConfig["fullscreen"] || []
  const hasUndo         = actionTools.includes("undo")
  const hasRedo         = actionTools.includes("redo")
  const hasFullscreen   = fullscreenTools.includes("fullscreen")

  const cluster = (hasUndo || hasRedo || hasFullscreen) ? (
    <div className="ne-toolbar-cluster">
      {(hasUndo || hasRedo) && (
        <div className="ne-toolbar-group">
          {hasUndo && (
            <Btn onMouseDown={e => { e.preventDefault(); editor.undo(); closeGroup() }}
              title="Undo" shortcut="Ctrl+Z"><Undo /></Btn>
          )}
          {hasRedo && (
            <Btn onMouseDown={e => { e.preventDefault(); editor.redo(); closeGroup() }}
              title="Redo" shortcut="Ctrl+Y"><Redo /></Btn>
          )}
        </div>
      )}
      {hasFullscreen && (
        <div className="ne-toolbar-group">
          <Btn
            onMouseDown={e => { e.preventDefault(); onToggleFullscreen?.(); closeGroup() }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            shortcut="F11" active={isFullscreen}
          >
            {isFullscreen ? <Minimize /> : <Maximize />}
          </Btn>
        </div>
      )}
    </div>
  ) : null

  // ── Sub-toolbars ────────────────────────────────────────────────────────

  const subToolbars = COLLAPSIBLE_GROUPS.map(group => {
    const tools = toolbarConfig[group.key]
    if (!tools || tools.length === 0) return null
    return (
      <SubToolbar
        key={group.key}
        open={openGroup === group.key}
        onClose={closeGroup}
        label={`${group.label} tools`}
      >
        {renderTools(group.key)}
      </SubToolbar>
    )
  }).filter(Boolean)

  return (
    <>
      <div
        ref={toolbarRef}
        className={`ne-toolbar${compact ? " compact" : ""}`}
        role="toolbar"
        aria-label="Text formatting toolbar"
      >
        <div className="ne-toolbar-collapsible">
          {collapsibleSection}
        </div>
        {cluster}
      </div>
      {subToolbars}
    </>
  )
}

// ── Toolbar button ────────────────────────────────────────────────────────────

export const Btn = ({ active = false, title, shortcut, children, ...props }) => {
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
