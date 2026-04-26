import { useRef, useEffect } from "react"

/**
 * SubToolbar — v2.2.1
 *
 * A slide-down panel that appears directly below the main toolbar row.
 * Renders inside .ne-root so CSS vars and theme context are always correct.
 * Used by all collapsible groups and will be reused for link/image/table
 * insertion panels in v2.4.0.
 *
 * Props:
 *   open       — boolean
 *   onClose    — called when Escape is pressed or click-outside detected
 *   label      — accessible label for the region
 *   children   — tool buttons or any form content
 */
const SubToolbar = ({ open, onClose, label = "Tools", children }) => {
  const ref = useRef(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === "Escape") onClose?.() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Focus trap / click-outside: close when focus leaves the toolbar entirely
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      // Walk up from the click target — if it exits .ne-container, close
      const container = ref.current?.closest(".ne-container")
      if (container && !container.contains(e.target)) {
        onClose?.()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, onClose])

  return (
    <div
      ref={ref}
      className={`ne-sub-toolbar${open ? " ne-sub-toolbar--open" : ""}`}
      role="region"
      aria-label={label}
      aria-hidden={!open}
    >
      <div className="ne-sub-toolbar-inner">
        {children}
      </div>
    </div>
  )
}

export default SubToolbar
