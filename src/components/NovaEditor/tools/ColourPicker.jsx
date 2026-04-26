import { useState, useRef, useEffect } from "react"

/**
 * ColourPicker
 *
 * A sub-toolbar-friendly colour selector. Renders a trigger button
 * that, when active, shows a palette grid + hex input inline in the
 * sub-toolbar (not a portal — stays in the DOM tree).
 *
 * Props:
 *   icon        — React element for the trigger button
 *   title       — accessible label
 *   value       — current colour value (hex string) or null
 *   onChange    — (hex: string | null) => void
 *   palette     — array of hex strings for the preset swatches
 *   allowClear  — show a "clear" swatch to remove the colour mark
 */

const DEFAULT_PALETTE = [
  "#000000","#434343","#666666","#999999","#b7b7b7","#cccccc","#d9d9d9","#ffffff",
  "#ff0000","#ff4444","#ff9900","#ffff00","#00ff00","#00ffff","#4a86e8","#9900ff",
  "#e6b8a2","#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#c9daf8","#d9d2e9",
  "#dd7e6b","#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#a4c2f4","#b4a7d6",
  "#cc4125","#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6d9eeb","#8e7cc3",
  "#a61c00","#cc0000","#e69138","#f1c232","#6aa84f","#45818e","#3c78d8","#674ea7",
]

const ColourPicker = ({
  icon,
  title,
  value      = null,
  onChange,
  palette    = DEFAULT_PALETTE,
  allowClear = true,
}) => {
  const [open,     setOpen]     = useState(false)
  const [hexInput, setHexInput] = useState(value || "")
  const wrapRef                 = useRef(null)
  const inputRef                = useRef(null)
  const panelRef                = useRef(null)

  useEffect(() => { setHexInput(value || "") }, [value])

  const apply = (colour) => {
    onChange(colour || null)
    setOpen(false)
  }

  const handleHexSubmit = (e) => {
    e.preventDefault()
    const raw = hexInput.trim()
    if (!raw) { apply(null); return }
    const hex = raw.startsWith("#") ? raw : `#${raw}`
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) apply(hex)
  }

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation() // prevent sub-toolbar close
    setOpen(v => !v)
    if (!open) setTimeout(() => inputRef.current?.focus(), 60)
  }

  // Close on outside mousedown
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    // Use capture so it fires before anything else
    document.addEventListener("mousedown", handler, true)
    return () => document.removeEventListener("mousedown", handler, true)
  }, [open])

  return (
    <div
      ref={wrapRef}
      className={`ne-colour-picker-wrap${open ? " ne-colour-picker-wrap--open" : ""}`}
    >
      <button
        type="button"
        className={`ne-btn ne-colour-trigger${open ? " open" : ""}${value ? " active" : ""}`}
        onMouseDown={handleToggle}
        aria-label={title}
        aria-expanded={open}
        title={title}
      >
        <span className="ne-colour-trigger-inner">
          {icon}
          <span
            className="ne-colour-trigger-swatch"
            style={{
              background:  value || "transparent",
              borderColor: value ? value : "var(--ne-border)",
            }}
          />
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="ne-colour-panel"
          role="dialog"
          aria-label={`${title} picker`}
          onMouseDown={e => e.stopPropagation()} // keep sub-toolbar open
        >
          <div className="ne-colour-grid">
            {allowClear && (
              <button
                type="button"
                className="ne-colour-swatch ne-colour-swatch--clear"
                onMouseDown={e => { e.preventDefault(); apply(null) }}
                title="Remove colour"
                aria-label="Remove colour"
              >
                <span className="ne-colour-swatch-clear-line" />
              </button>
            )}
            {palette.map(colour => (
              <button
                key={colour}
                type="button"
                className={`ne-colour-swatch${value === colour ? " ne-colour-swatch--active" : ""}`}
                style={{ background: colour }}
                onMouseDown={e => { e.preventDefault(); apply(colour) }}
                title={colour}
                aria-label={colour}
                aria-pressed={value === colour}
              />
            ))}
          </div>

          <form className="ne-colour-hex-row" onSubmit={handleHexSubmit}>
            <div
              className="ne-colour-hex-preview"
              style={{
                background: hexInput
                  ? (hexInput.startsWith("#") ? hexInput : `#${hexInput}`)
                  : "transparent",
              }}
            />
            <input
              ref={inputRef}
              type="text"
              className="ne-colour-hex-input"
              value={hexInput}
              onChange={e => setHexInput(e.target.value)}
              placeholder="#000000"
              maxLength={7}
              spellCheck={false}
              aria-label="Custom hex colour"
            />
            <button type="submit" className="ne-colour-hex-apply" aria-label="Apply colour">
              ↵
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ColourPicker
