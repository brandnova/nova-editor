import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

/**
 * ToolbarGroupDropdown
 *
 * Renders a trigger button that, when clicked, opens a floating panel
 * containing the group's tools. The panel is portalled to document.body
 * so it escapes any overflow:hidden ancestors.
 *
 * Props:
 *   triggerIcon  — React element to render as the trigger button icon
 *   triggerLabel — accessible label for the trigger button
 *   children     — tool buttons (or any content) inside the dropdown
 *   isActive     — whether any tool in this group is currently active
 */
const ToolbarGroupDropdown = ({ triggerIcon, triggerLabel, children, isActive = false }) => {
  const [open,       setOpen]       = useState(false)
  const [position,   setPosition]   = useState({ top: 0, left: 0 })
  const triggerRef  = useRef(null)
  const dropdownRef = useRef(null)

  // Position the dropdown below the trigger button
  const updatePosition = () => {
    const btn = triggerRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    setPosition({
      top:  rect.bottom + window.scrollY + 6,
      left: rect.left   + window.scrollX,
    })
  }

  const toggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!open) updatePosition()
    setOpen(v => !v)
  }

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        triggerRef.current  && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    const handleKey = (e) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown",   handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown",   handleKey)
    }
  }, [open])

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!open) return
    const handle = () => updatePosition()
    window.addEventListener("scroll",  handle, true)
    window.addEventListener("resize",  handle)
    return () => {
      window.removeEventListener("scroll",  handle, true)
      window.removeEventListener("resize",  handle)
    }
  }, [open])

  // Close dropdown when a tool inside is activated (mousedown fires, then blur)
  const handleDropdownMouseDown = (e) => {
    // Let the tool's own onMouseDown fire first, then close
    requestAnimationFrame(() => setOpen(false))
  }

  const dropdown = open && createPortal(
    <div
      ref={dropdownRef}
      className="ne-group-dropdown"
      style={{ top: position.top, left: position.left }}
      onMouseDown={handleDropdownMouseDown}
      role="toolbar"
      aria-label={`${triggerLabel} tools`}
    >
      <div className="ne-group-dropdown-inner">
        {children}
      </div>
    </div>,
    document.body
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`ne-btn ne-group-trigger${isActive ? " active" : ""}${open ? " open" : ""}`}
        onMouseDown={toggle}
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {triggerIcon}
        {/* Small indicator dot when group has an active tool */}
        {isActive && <span className="ne-group-trigger-dot" aria-hidden="true" />}
        <span className="ne-tooltip" role="tooltip">{triggerLabel}</span>
      </button>
      {dropdown}
    </>
  )
}

export default ToolbarGroupDropdown
