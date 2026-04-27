import { useState, useCallback } from "react"
import { useSlate } from "slate-react"
import { Editor, Transforms, Text } from "slate"
import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3, Type,
  Quote, List, ListOrdered, Minus, Code2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Maximize, Minimize,
  ChevronDown, MoreVertical,
  Subscript, Superscript, RemoveFormatting,
  Palette, Highlighter, CaseSensitive, TextCursor,
  Link, ImageIcon, Smile, Omega,
} from "lucide-react"
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from "./NovaEditor"
import SubToolbar from "./SubToolbar"
import { useToolbarCollapse } from "./useToolbarCollapse"
import ColourPicker from "./tools/ColourPicker"
import FontFamilySelect from "./tools/FontFamilySelect"
import FontSizeSelect from "./tools/FontSizeSelect"
import InsertPanel from "./tools/InsertPanel"

// ── Tool metadata ─────────────────────────────────────────────────────────────

export const TOOL_META = {
  bold:            { type: "mark",   Icon: Bold,             title: "Bold",             shortcut: "Ctrl+B" },
  italic:          { type: "mark",   Icon: Italic,           title: "Italic",           shortcut: "Ctrl+I" },
  underline:       { type: "mark",   Icon: Underline,        title: "Underline",        shortcut: "Ctrl+U" },
  strikethrough:   { type: "mark",   Icon: Strikethrough,    title: "Strikethrough",    shortcut: "Ctrl+Shift+S" },
  code:            { type: "mark",   Icon: Code,             title: "Inline Code",      shortcut: "Ctrl+`" },
  subscript:       { type: "mark",   Icon: Subscript,        title: "Subscript",        shortcut: "Ctrl+," },
  superscript:     { type: "mark",   Icon: Superscript,      title: "Superscript",      shortcut: "Ctrl+." },
  clearFormatting: { type: "action", Icon: RemoveFormatting, title: "Clear Formatting", actionKey: "clearFormatting" },
  fontFamily:      { type: "custom", Icon: CaseSensitive,    title: "Font Family" },
  fontSize:        { type: "custom", Icon: TextCursor,       title: "Font Size" },
  textColor:       { type: "custom", Icon: Palette,          title: "Text Colour" },
  bgColor:         { type: "custom", Icon: Highlighter,      title: "Highlight Colour" },
  "heading-one":   { type: "block",  Icon: Heading1,         title: "Heading 1" },
  "heading-two":   { type: "block",  Icon: Heading2,         title: "Heading 2" },
  "heading-three": { type: "block",  Icon: Heading3,         title: "Heading 3" },
  paragraph:       { type: "action", Icon: Type,             title: "Paragraph",        actionKey: "paragraph" },
  left:            { type: "align",  Icon: AlignLeft,        title: "Align Left" },
  center:          { type: "align",  Icon: AlignCenter,      title: "Align Center" },
  right:           { type: "align",  Icon: AlignRight,       title: "Align Right" },
  justify:         { type: "align",  Icon: AlignJustify,     title: "Align Justify" },
  "block-quote":     { type: "block",  Icon: Quote,          title: "Blockquote" },
  "bulleted-list":   { type: "block",  Icon: List,           title: "Bullet List" },
  "numbered-list":   { type: "block",  Icon: ListOrdered,    title: "Numbered List" },
  "code-block":      { type: "block",  Icon: Code2,          title: "Code Block" },
  "horizontal-rule": { type: "action", Icon: Minus,          title: "Divider",          actionKey: "horizontal-rule" },
}

// ── Group definitions ─────────────────────────────────────────────────────────
// All groups including the actions cluster are defined here uniformly.
// The toolbar renders all of them as trigger buttons in a single flex row.

export const ALL_GROUPS = [
  { key: "formatting", label: "Formatting", Icon: Bold,         isCluster: false },
  { key: "headings",   label: "Headings",   Icon: Heading1,     isCluster: false },
  { key: "alignment",  label: "Alignment",  Icon: AlignLeft,    isCluster: false },
  { key: "blocks",     label: "Blocks",     Icon: List,         isCluster: false },
  { key: "insert", label: "Insert", Icon: Link, isCluster: false },
  // The actions cluster — visually distinct via isCluster flag
  // Uses MoreVertical (⋮) instead of a content icon + chevron
  { key: "cluster",    label: "Actions",    Icon: MoreVertical, isCluster: true  },
]

// ── Toolbar ───────────────────────────────────────────────────────────────────

const Toolbar = ({
  toolbarConfig      = {},
  isFullscreen       = false,
  compact            = false,
  onToggleFullscreen,
}) => {
  const editor         = useSlate()
  const { toolbarRef } = useToolbarCollapse()
  const [openGroup, setOpenGroup] = useState(null)

  const toggleGroup  = useCallback((key) => {
    setOpenGroup(prev => prev === key ? null : key)
  }, [])
  const closeGroup   = useCallback(() => setOpenGroup(null), [])

  // ── Mark helpers ────────────────────────────────────────────────────────

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
    // The cluster is never "active" in the formatting sense
    if (groupKey === "cluster") return false
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
          Transforms.insertNodes(editor, {
            type: "horizontal-rule", children: [{ text: "" }],
          })
        if (meta.actionKey === "clearFormatting")
          clearAllFormatting(editor)
        break
    }
    closeGroup()
  }

  const clearAllFormatting = (ed) => {
    const { selection } = ed
    if (!selection) return
    const markKeys = new Set()
    for (const [node] of Editor.nodes(ed, {
      at: selection, match: n => Text.isText(n),
    })) {
      Object.keys(node).forEach(key => { if (key !== "text") markKeys.add(key) })
    }
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

  // ── Render tools for a group's sub-toolbar ──────────────────────────────

  const renderGroupTools = (groupKey) => {
    const tools = toolbarConfig[groupKey]
    if (!tools || tools.length === 0) return null

    return tools.map(toolKey => {
      if (toolKey === "textColor") return (
        <ColourPicker key="textColor" icon={<Palette />} title="Text Colour"
          value={getMarkValue("color")}
          onChange={val => handleColourChange("color", val)} allowClear />
      )
      if (toolKey === "bgColor") return (
        <ColourPicker key="bgColor" icon={<Highlighter />} title="Highlight Colour"
          value={getMarkValue("backgroundColor")}
          onChange={val => handleColourChange("backgroundColor", val)} allowClear />
      )
      if (toolKey === "fontFamily") return (
        <FontFamilySelect key="fontFamily"
          value={getMarkValue("fontFamily") || ""}
          onChange={handleFontFamily} />
      )
      if (toolKey === "fontSize") return (
        <FontSizeSelect key="fontSize"
          value={getMarkValue("fontSize") || ""}
          onChange={handleFontSize} />
      )

      const meta = TOOL_META[toolKey]
      if (!meta) return null
      const { Icon } = meta
      return (
        <Btn key={toolKey} onMouseDown={e => handleToolClick(toolKey, e)}
          title={meta.title} shortcut={meta.shortcut} active={isToolActive(toolKey)}>
          <Icon />
        </Btn>
      )
    }).filter(Boolean)
  }

  // ── Render the cluster sub-toolbar (undo/redo/fullscreen/settings) ──────

  const renderClusterTools = () => {
    const actionTools     = toolbarConfig["actions"]    || []
    const fullscreenTools = toolbarConfig["fullscreen"] || []
    const hasUndo         = actionTools.includes("undo")
    const hasRedo         = actionTools.includes("redo")
    const hasFullscreen   = fullscreenTools.includes("fullscreen")

    if (!hasUndo && !hasRedo && !hasFullscreen) return null

    return (
      <>
        {hasUndo && (
          <Btn
            onMouseDown={e => { e.preventDefault(); editor.undo() }}
            title="Undo" shortcut="Ctrl+Z"
          >
            <Undo />
          </Btn>
        )}
        {hasRedo && (
          <Btn
            onMouseDown={e => { e.preventDefault(); editor.redo() }}
            title="Redo" shortcut="Ctrl+Y"
          >
            <Redo />
          </Btn>
        )}
        {hasFullscreen && (
          <Btn
            onMouseDown={e => {
              e.preventDefault()
              onToggleFullscreen?.()
              closeGroup()
            }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            shortcut="F11"
            active={isFullscreen}
          >
            {isFullscreen ? <Minimize /> : <Maximize />}
          </Btn>
        )}
        {/* Settings slot — v2.5.0 */}
      </>
    )
  }

  // ── Check whether the cluster has any tools to show ─────────────────────

  const clusterHasTools = () => {
    const a = toolbarConfig["actions"]    || []
    const f = toolbarConfig["fullscreen"] || []
    return a.includes("undo") || a.includes("redo") || f.includes("fullscreen")
  }

  // ── Render all group trigger buttons + their sub-toolbars ────────────────

  const triggerButtons = []
  const subToolbarPanels = []

  ALL_GROUPS.forEach((group, idx) => {
    // Determine whether this group has any tools configured
    const hasTools = group.isCluster
      ? clusterHasTools()
      : !!(toolbarConfig[group.key]?.length)

    if (!hasTools) return

    const isOpen   = openGroup === group.key
    const active   = isGroupActive(group.key)
    const { Icon } = group

    // Trigger button
    triggerButtons.push(
      <div key={group.key} style={{ 
        display: "flex", 
        alignItems: "center",
        ...(group.isCluster && { marginLeft: "auto" })
      }}>
        {!group.isCluster && idx > 0 && triggerButtons.length > 0 && (
          <div className="ne-toolbar-sep" aria-hidden="true" />
        )}
        <button
          type="button"
          className={[
            "ne-btn",
            "ne-group-trigger",
            group.isCluster ? "ne-group-trigger--cluster" : "",
            isOpen  ? "open"   : "",
            active  ? "active" : "",
          ].filter(Boolean).join(" ")}
          onMouseDown={e => { e.preventDefault(); toggleGroup(group.key) }}
          aria-label={group.label}
          aria-expanded={isOpen}
          aria-haspopup="true"
          title={group.label}
        >
          <Icon />
          {/* Cluster uses no chevron — the ⋮ icon communicates "more" on its own */}
          {!group.isCluster && (
            <ChevronDown className="ne-group-trigger-chevron" />
          )}
          {active && !isOpen && (
            <span className="ne-group-trigger-dot" aria-hidden="true" />
          )}
        </button>
      </div>
    )

    // Sub-toolbar panel
    subToolbarPanels.push(
      <SubToolbar
        key={group.key}
        open={isOpen}
        onClose={closeGroup}
        label={`${group.label} tools`}
      >
        {group.key === "insert"
          ? <InsertPanel tools={toolbarConfig["insert"] || []} onClose={closeGroup} />
          : group.isCluster
            ? renderClusterTools()
            : renderGroupTools(group.key)
        }
      </SubToolbar>
    )
  })

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={`ne-toolbar-wrap${compact ? " compact" : ""}`}>
      <div
        ref={toolbarRef}
        className="ne-toolbar"
        role="toolbar"
        aria-label="Text formatting toolbar"
      >
        {triggerButtons}
      </div>
      {subToolbarPanels}
    </div>
  )
}

// ── Toolbar button ─────────────────────────────────────────────────────────

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
