import { useState, useEffect, useRef, useCallback } from "react"

/**
 * useToolbarCollapse — v2.2.1
 *
 * Measures the toolbar width and determines:
 * 1. Which collapsible groups to collapse (all of them — main bar only shows triggers)
 * 2. Whether the right cluster needs to wrap to a second row
 *
 * In the new sub-toolbar architecture, ALL collapsible groups are always
 * "collapsed" into trigger buttons on the main bar. The hook's job is now
 * purely to detect when the cluster needs to wrap.
 */
export function useToolbarCollapse() {
  const toolbarRef      = useRef(null)
  const [twoRow, setTwoRow] = useState(false)
  const measuredOnce    = useRef(false)

  const measure = useCallback(() => {
    const el = toolbarRef.current
    if (!el) return

    const collapsible = el.querySelector(".ne-toolbar-collapsible")
    const cluster     = el.querySelector(".ne-toolbar-cluster")
    if (!collapsible || !cluster) return

    // scrollWidth can read 0 if layout hasn't completed — guard against it
    if (collapsible.scrollWidth === 0 && !measuredOnce.current) return

    measuredOnce.current = true

    const available        = el.offsetWidth - 32
    const collapsibleWidth = collapsible.scrollWidth
    const clusterWidth     = cluster.scrollWidth
    const gap              = 12

    setTwoRow(collapsibleWidth + gap + clusterWidth > available)
  }, [])

  useEffect(() => {
    const el = toolbarRef.current
    if (!el) return

    const ro = new ResizeObserver(() => measure())
    ro.observe(el)

    // Triple-deferred measurement:
    // rAF 1 — after browser has committed the render
    // rAF 2 — after the paint, when scrollWidth is reliable
    // setTimeout 100ms — final fallback for slow font loads
    let raf1, raf2, timer
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        measure()
        timer = setTimeout(measure, 100)
      })
    })

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(timer)
    }
  }, [measure])

  useEffect(() => {
    const el = toolbarRef.current
    if (!el) return
    if (twoRow) el.classList.add("ne-toolbar--two-row")
    else        el.classList.remove("ne-toolbar--two-row")
  }, [twoRow])

  return { toolbarRef }
}
