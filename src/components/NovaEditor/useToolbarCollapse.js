import { useRef } from "react"

/**
 * useToolbarCollapse — v2.2.2
 *
 * All toolbar groups (including the actions cluster) are now fixed-size
 * trigger buttons in a single flex row. There is no dynamic collapse logic
 * or width measurement. The toolbar is a standard flex container and the
 * browser handles layout naturally.
 *
 * This hook is kept as a thin wrapper so Toolbar.jsx's import doesn't change.
 */
export function useToolbarCollapse() {
  const toolbarRef = useRef(null)
  return { toolbarRef }
}
