import { useState, useRef, useEffect } from "react"
import { Editor, Transforms, Range, Element as SlateElement } from "slate"
import { ReactEditor } from "slate-react"
import { Link, ExternalLink, Unlink } from "lucide-react"

// ── Helpers ───────────────────────────────────────────────────────────────────

const isLinkActive = (editor) => {
  try {
    const [link] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
    })
    return !!link
  } catch { return false }
}

const getLinkData = (editor, savedSelection) => {
  // Use saved selection since editor.selection may be null after blur
  try {
    const at = editor.selection || savedSelection
    if (!at) return null
    const [match] = Editor.nodes(editor, {
      at,
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
    })
    return match ? match[0] : null
  } catch { return null }
}

const restoreAndFocus = (editor, savedSelection) => {
  try {
    ReactEditor.focus(editor)
    if (savedSelection) Transforms.select(editor, savedSelection)
  } catch { /* ignore focus errors */ }
}

// ── Component ─────────────────────────────────────────────────────────────────

const LinkTool = ({ onClose, editor, savedSelectionRef }) => {
  const saved = savedSelectionRef?.current

  // Read existing link using the saved selection (editor may have lost focus)
  const existingLink = getLinkData(editor, saved)
  const isEdit       = !!existingLink

  const [href,   setHref]   = useState(existingLink?.href   || "")
  const [text,   setText]   = useState("")
  const [newTab, setNewTab] = useState(existingLink?.target === "_blank" || false)

  const hrefRef = useRef(null)
  useEffect(() => { setTimeout(() => hrefRef.current?.focus(), 60) }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = href.trim()
    if (!trimmed) return

    const finalHref = /^(https?:\/\/|\/|mailto:|tel:)/.test(trimmed)
      ? trimmed
      : `https://${trimmed}`

    restoreAndFocus(editor, saved)

    setTimeout(() => {
      // If we're inside an existing link, expand selection to cover
      // the entire link node first — even if only the cursor is inside it
      const [linkEntry] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
      })

      if (linkEntry) {
        // Select the full link node before unwrapping
        const [, linkPath] = linkEntry
        Transforms.select(editor, linkPath)
      }

      // Remove any existing link
      Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
      })

      const { selection } = editor
      const isCollapsed   = selection && Range.isCollapsed(selection)

      if (isCollapsed) {
        Transforms.insertNodes(editor, {
          type:     "link",
          href:     finalHref,
          target:   newTab ? "_blank" : "_self",
          children: [{ text: text.trim() || finalHref }],
        })
      } else {
        Transforms.wrapNodes(
          editor,
          { type: "link", href: finalHref, target: newTab ? "_blank" : "_self", children: [] },
          { split: true }
        )
        Transforms.collapse(editor, { edge: "end" })
      }

      onClose?.()
    }, 10)
  }

  const handleRemove = (e) => {
    e.preventDefault()
    restoreAndFocus(editor, saved)
    setTimeout(() => {
      Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
      })
      onClose?.()
    }, 10)
  }

  return (
    <div className="ne-insert-form" onMouseDown={e => e.stopPropagation()}>
      <div className="ne-insert-form-header">
        <Link className="ne-insert-form-icon" />
        <span className="ne-insert-form-title">
          {isEdit ? "Edit Link" : "Insert Link"}
        </span>
        {isEdit && (
          <button
            type="button"
            className="ne-insert-form-action-btn ne-insert-form-remove"
            onMouseDown={handleRemove}
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

        {!isEdit && (
          <div className="ne-insert-field">
            <label className="ne-insert-label">Display text (optional)</label>
            <input
              type="text"
              className="ne-insert-input"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Leave empty to use URL"
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
            {isEdit ? "Update" : "Insert"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LinkTool
