import { useState, useRef, useEffect } from "react"
import { useSlate } from "slate-react"
import { Editor, Transforms, Range, Element as SlateElement } from "slate"
import { Link, ExternalLink, Unlink } from "lucide-react"
import { Btn } from "../Toolbar"

/**
 * LinkTool
 *
 * Renders inside the Insert sub-toolbar.
 * Shows insert form when no link is selected.
 * Shows edit/remove controls when cursor is inside an existing link.
 *
 * Serialises to: <a href="..." target="...">text</a>
 */

// ── Slate helpers ─────────────────────────────────────────────────────────────

const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  })
  return !!link
}

const getLinkNode = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  })
  return match ? match[0] : null
}

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  })
}

const wrapLink = (editor, href, text, newTab) => {
  if (isLinkActive(editor)) unwrapLink(editor)

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)

  const linkNode = {
    type:    "link",
    href,
    target:  newTab ? "_blank" : "_self",
    children: isCollapsed ? [{ text: text || href }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, linkNode)
  } else {
    Transforms.wrapNodes(editor, linkNode, { split: true })
    Transforms.collapse(editor, { edge: "end" })
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const LinkTool = ({ onClose }) => {
  const editor        = useSlate()
  const linkActive    = isLinkActive(editor)
  const existingLink  = getLinkNode(editor)

  const [href,   setHref]   = useState(existingLink?.href   || "")
  const [text,   setText]   = useState(existingLink?.children?.[0]?.text || "")
  const [newTab, setNewTab] = useState(existingLink?.target === "_blank" || false)
  const [mode,   setMode]   = useState(linkActive ? "edit" : "insert")

  const hrefRef = useRef(null)

  useEffect(() => {
    setTimeout(() => hrefRef.current?.focus(), 50)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!href.trim()) return
    const finalHref = href.startsWith("http") ? href : `https://${href}`
    wrapLink(editor, finalHref, text, newTab)
    onClose?.()
  }

  const handleRemove = (e) => {
    e.preventDefault()
    unwrapLink(editor)
    onClose?.()
  }

  return (
    <div className="ne-insert-form" onMouseDown={e => e.stopPropagation()}>
      <div className="ne-insert-form-header">
        <Link className="ne-insert-form-icon" />
        <span className="ne-insert-form-title">
          {mode === "edit" ? "Edit Link" : "Insert Link"}
        </span>
        {linkActive && (
          <button
            type="button"
            className="ne-insert-form-action-btn ne-insert-form-remove"
            onMouseDown={handleRemove}
            title="Remove link"
          >
            <Unlink /> Remove
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="ne-insert-form-fields">
        <div className="ne-insert-field">
          <label className="ne-insert-label">URL</label>
          <input
            ref={hrefRef}
            type="text"
            className="ne-insert-input"
            value={href}
            onChange={e => setHref(e.target.value)}
            placeholder="https://example.com"
            spellCheck={false}
          />
        </div>

        {/* Only show text field when inserting with collapsed selection */}
        {!linkActive && (
          <div className="ne-insert-field">
            <label className="ne-insert-label">Display text (optional)</label>
            <input
              type="text"
              className="ne-insert-input"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Link text…"
            />
          </div>
        )}

        <div className="ne-insert-field ne-insert-field--row">
          <label className="ne-insert-toggle-label">
            <input
              type="checkbox"
              checked={newTab}
              onChange={e => setNewTab(e.target.checked)}
              className="ne-insert-checkbox"
            />
            Open in new tab
          </label>

          <button type="submit" className="ne-insert-submit">
            <ExternalLink />
            {mode === "edit" ? "Update" : "Insert"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LinkTool
