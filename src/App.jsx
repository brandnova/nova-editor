import { useState } from "react"
import NovaEditor from "./components/NovaEditor"
import { NAMED_THEMES } from "./theme-config"
import { TOOLBAR_PRESETS } from "./presets"
import logoUrl from "./assets/logo.png"

const UI_PRESETS    = Object.keys(NAMED_THEMES)
const TOOLBAR_NAMES = Object.keys(TOOLBAR_PRESETS)

// Nav height in px — used to offset the sticky toolbar
const NAV_HEIGHT = 56

export default function App() {
  // Playground own theme (independent of editor)
  const [pgDark, setPgDark] = useState(true)

  // Editor config
  const [uiPreset,     setUiPreset]     = useState("valiux")
  const [toolbar,      setToolbar]      = useState("full")
  const [colorMode,    setColorMode]    = useState("dark")
  const [glass,        setGlass]        = useState(true)
  const [showCount,    setShowCount]    = useState(true)
  const [sticky,       setSticky]       = useState(true)
  const [showBranding, setShowBranding] = useState(true)
  const [maxHeight,    setMaxHeight]    = useState("")
  const [radius,       setRadius]       = useState("")
  const [radiusBtn,    setRadiusBtn]    = useState("")
  const [htmlOutput,   setHtmlOutput]   = useState("")

  const borderOverrides = {}
  if (radius)    borderOverrides.radius    = radius
  if (radiusBtn) borderOverrides.radiusBtn = radiusBtn

  const uiConfig = {
    preset: uiPreset,
    glass,
    ...(Object.keys(borderOverrides).length ? { borders: borderOverrides } : {}),
  }

  const parsedMaxHeight = maxHeight && !isNaN(parseInt(maxHeight)) ? parseInt(maxHeight) : null

  // Playground palette — matches index.html colors
  const p = pgDark ? dark : light

  return (
    <div style={{ ...pg.page, background: p.bg, color: p.text }}>
      {/* ── Sticky nav ── */}
      <header style={{ ...pg.header, background: p.surface, borderColor: p.border }}>
        <div style={pg.headerInner}>
          <div style={pg.logoRow}>
            <img src={logoUrl} alt="Brand Nova" style={pg.headerLogo} />
            <div>
              <h1 style={{ ...pg.title, color: p.text }}>Nova Editor</h1>
              <p style={{ ...pg.subtitle, color: p.muted }}>by Brand Nova</p>
            </div>
            <span style={{ ...pg.badge, background: p.badgeBg, border: `1px solid ${p.border}`, color: p.muted }}>
              v2.0.0
            </span>
          </div>
          <div style={pg.headerActions}>
            {/* Playground theme toggle */}
            <button
              type="button"
              onClick={() => setPgDark(v => !v)}
              style={{ ...pg.themeToggle, background: p.toggleBg, border: `1px solid ${p.border}`, color: p.muted }}
              title="Toggle playground theme"
            >
              {pgDark ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </header>

      <main style={pg.main}>
        {/* ── Config panel ── */}
        <section style={{ ...pg.panel, background: p.surface, borderColor: p.border }}>
          <p style={{ ...pg.sectionLabel, color: p.muted }}>Configuration</p>
          <div style={pg.grid}>
            <Sel label="UI Theme"       value={uiPreset}  onChange={setUiPreset}  opts={UI_PRESETS}                     p={p} />
            <Sel label="Toolbar Preset" value={toolbar}   onChange={setToolbar}   opts={TOOLBAR_NAMES}                  p={p} />
            <Sel label="Color Mode"     value={colorMode} onChange={setColorMode} opts={["light","dark","system"]}      p={p} />
            <Tog label="Glass Effect"   value={glass}         onChange={setGlass}        p={p} />
            <Tog label="Word Count"     value={showCount}     onChange={setShowCount}    p={p} />
            <Tog label="Sticky Toolbar" value={sticky}        onChange={setSticky}       p={p} />
            <Tog label="Branding"       value={showBranding}  onChange={setShowBranding} p={p} />
            <Inp label="Max Height (px)" value={maxHeight} onChange={setMaxHeight} ph="e.g. 400"    p={p} />
            <Inp label="Outer Radius"    value={radius}    onChange={setRadius}    ph="e.g. 1.5rem" p={p} />
            <Inp label="Button Radius"   value={radiusBtn} onChange={setRadiusBtn} ph="e.g. 999px"  p={p} />
          </div>
        </section>

        {/* ── Editor ── */}
        <section>
          <p style={{ ...pg.sectionLabel, color: p.muted }}>Editor Preview</p>
          {/*
            --ne-sticky-top tells the editor toolbar to sit below the sticky nav.
            The value must match NAV_HEIGHT px.
          */}
          <div style={{ "--ne-sticky-top": `${NAV_HEIGHT}px` }}>
            <NovaEditor
              preset={toolbar}
              uiConfig={uiConfig}
              colorMode={colorMode}
              glass={glass}
              showWordCount={showCount}
              stickyToolbar={sticky}
              maxHeight={parsedMaxHeight}
              branding={showBranding ? { logo: logoUrl, name: "Brand Nova" } : null}
              placeholder="Start writing, paste Markdown, or try the toolbar…"
              onHTMLChange={setHtmlOutput}
              autoFocus={false}
            />
          </div>
        </section>

        {/* ── HTML output ── */}
        {htmlOutput && (
          <section>
            <p style={{ ...pg.sectionLabel, color: p.muted }}>HTML Output</p>
            <pre style={pg.pre}>{htmlOutput}</pre>
          </section>
        )}

        {/* ── Shortcuts ── */}
        <section style={{ ...pg.panel, background: p.surface, borderColor: p.border }}>
          <p style={{ ...pg.sectionLabel, color: p.muted }}>Keyboard Shortcuts</p>
          <div style={pg.kbdGrid}>
            {[
              ["Ctrl+B","Bold"], ["Ctrl+I","Italic"], ["Ctrl+U","Underline"],
              ["Ctrl+`","Inline Code"], ["Ctrl+Shift+S","Strikethrough"],
              ["Ctrl+Z","Undo"], ["Ctrl+Y / Ctrl+Shift+Z","Redo"], ["F11","Fullscreen"],
            ].map(([k, v]) => (
              <div key={k} style={pg.kbdRow}>
                <kbd style={{ ...pg.kbd, background: p.kbdBg, border: `1px solid ${p.border}`, color: p.text }}>{k}</kbd>
                <span style={{ ...pg.kbdLabel, color: p.muted }}>{v}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

/* ── Controls ── */
const Sel = ({ label, value, onChange, opts, p }) => (
  <label style={ctrl.wrap}>
    <span style={{ ...ctrl.label, color: p.muted }}>{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...ctrl.select, background: p.inputBg, border: `1px solid ${p.border}`, color: p.text }}>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
)

const Tog = ({ label, value, onChange, p }) => (
  <label style={{ ...ctrl.wrap, cursor: "pointer" }}>
    <span style={{ ...ctrl.label, color: p.muted }}>{label}</span>
    <button type="button" onClick={() => onChange(!value)} style={{
      ...ctrl.toggleBase,
      background: value ? "#f0fdf4" : p.inputBg,
      border:     `1px solid ${value ? "#86efac" : p.border}`,
      color:      value ? "#15803d" : p.muted,
    }}>
      {value ? "✓ On" : "Off"}
    </button>
  </label>
)

const Inp = ({ label, value, onChange, ph, p }) => (
  <label style={ctrl.wrap}>
    <span style={{ ...ctrl.label, color: p.muted }}>{label}</span>
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={ph}
      style={{ ...ctrl.input, background: p.inputBg, border: `1px solid ${p.border}`, color: p.text }} />
  </label>
)

/* ── Palette tokens - matches index.html colors ── */
const light = {
  bg: "#f8f9fa",
  surface: "#ffffff",
  border: "#bababa",
  text: "#1a1a2e",
  muted: "#6e7178",
  inputBg: "#f9fafb",
  badgeBg: "#f3f4f6",
  toggleBg: "#f3f4f6",
  kbdBg: "#f3f4f6",
}

const dark = {
  bg: "#0d0d0d",
  surface: "#111111",
  border: "rgba(255,255,255,0.15)",
  text: "#e5e5e5",
  muted: "#9da3af",
  inputBg: "rgba(255,255,255,0.05)",
  badgeBg: "rgba(255,255,255,0.05)",
  toggleBg: "rgba(255,255,255,0.05)",
  kbdBg: "rgba(255,255,255,0.06)",
}

/* ── Layout styles with mobile responsiveness ── */
const pg = {
  page: { minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", transition: "background 0.2s, color 0.2s" },
  header: {
    padding: "0 1rem",
    height: 56,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid",
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    "@media (minWidth: 640px)": { padding: "0 2rem" }
  },
  headerInner: {
    maxWidth: 960,
    margin: "0 auto",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoRow:    { display: "flex", alignItems: "center", gap: "0.75rem" },
  headerLogo: { height: 28, width: "auto" },
  title:      { margin: 0, fontSize: "1rem", fontWeight: 700, lineHeight: 1 },
  subtitle:   { margin: "0.15rem 0 0", fontSize: "0.7rem" },
  themeToggle: {
    fontSize: "0.7rem",
    fontWeight: 600,
    fontFamily: "inherit",
    borderRadius: "0.375rem",
    padding: "0.3rem 0.65rem",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  badge: {
    fontSize: "0.63rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    borderRadius: "999px",
    padding: "0.2rem 0.6rem",
    "@media (minWidth: 640px)": { display: "inline-block" }
  },
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    "@media (minWidth: 640px)": { padding: "2rem", gap: "1.75rem" }
  },
  panel: {
    border: "1px solid",
    borderRadius: "0.75rem",
    padding: "1rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    "@media (minWidth: 640px)": { padding: "1.25rem" }
  },
  sectionLabel: {
    margin: "0 0 0.875rem",
    fontSize: "0.63rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "0.75rem",
    "@media (minWidth: 640px)": { gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }
  },
  pre: {
    background: "#1e1e2e",
    border: "1px solid #2d2d3f",
    borderRadius: "0.5rem",
    padding: "1rem",
    fontSize: "0.7rem",
    color: "#a3e635",
    fontFamily: "'JetBrains Mono', monospace",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    maxHeight: 200,
    overflowY: "auto",
    margin: 0,
    "@media (minWidth: 640px)": { fontSize: "0.72rem" }
  },
  kbdGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0.5rem",
    "@media (minWidth: 480px)": { gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }
  },
  kbdRow:  { display: "flex", alignItems: "center", gap: "0.5rem" },
  kbd: {
    borderRadius: "4px",
    padding: "0.15rem 0.4rem",
    fontSize: "0.65rem",
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  kbdLabel: { fontSize: "0.75rem" },
}

const ctrl = {
  wrap:  { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" },
  select: {
    borderRadius: "0.375rem",
    padding: "0.375rem 0.5rem",
    fontSize: "0.75rem",
    cursor: "pointer",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
  },
  toggleBase: {
    borderRadius: "0.375rem",
    padding: "0.35rem 0.75rem",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "left",
    transition: "all 0.15s",
    fontFamily: "inherit",
  },
  input: {
    borderRadius: "0.375rem",
    padding: "0.375rem 0.5rem",
    fontSize: "0.75rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
}