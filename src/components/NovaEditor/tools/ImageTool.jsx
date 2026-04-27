import { useState, useRef, useEffect } from "react"
import { useSlate } from "slate-react"
import { Transforms } from "slate"
import { ImageIcon, Plus } from "lucide-react"

/**
 * ImageTool
 *
 * URL-based image insertion. Renders as a void block element.
 * Serialises to: <img src="..." alt="...">
 * File upload can be added in a future version by replacing/extending
 * the URL input with a file picker that converts to base64 or a presigned URL.
 */

const ImageTool = ({ onClose }) => {
  const editor    = useSlate()
  const [src,    setSrc]    = useState("")
  const [alt,    setAlt]    = useState("")
  const [error,  setError]  = useState("")
  const srcRef              = useRef(null)

  useEffect(() => {
    setTimeout(() => srcRef.current?.focus(), 50)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = src.trim()
    if (!url) { setError("URL is required"); return }
    if (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:")) {
      setError("Enter a valid URL")
      return
    }
    setError("")

    Transforms.insertNodes(editor, {
      type:     "image",
      src:      url,
      alt:      alt.trim() || "",
      children: [{ text: "" }],
    })

    // Insert a paragraph after the image so the cursor has somewhere to go
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [{ text: "" }],
    })

    onClose?.()
  }

  return (
    <div className="ne-insert-form" onMouseDown={e => e.stopPropagation()}>
      <div className="ne-insert-form-header">
        <ImageIcon className="ne-insert-form-icon" />
        <span className="ne-insert-form-title">Insert Image</span>
      </div>

      <form onSubmit={handleSubmit} className="ne-insert-form-fields">
        <div className="ne-insert-field">
          <label className="ne-insert-label">Image URL</label>
          <input
            ref={srcRef}
            type="text"
            className={`ne-insert-input${error ? " ne-insert-input--error" : ""}`}
            value={src}
            onChange={e => { setSrc(e.target.value); setError("") }}
            placeholder="https://example.com/image.jpg"
            spellCheck={false}
          />
          {error && <span className="ne-insert-error">{error}</span>}
        </div>

        <div className="ne-insert-field">
          <label className="ne-insert-label">Alt text (optional)</label>
          <input
            type="text"
            className="ne-insert-input"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            placeholder="Describe the image…"
          />
        </div>

        <div className="ne-insert-field ne-insert-field--row">
          <span className="ne-insert-hint">File upload coming in a future version</span>
          <button type="submit" className="ne-insert-submit">
            <Plus />
            Insert
          </button>
        </div>
      </form>
    </div>
  )
}

export default ImageTool
