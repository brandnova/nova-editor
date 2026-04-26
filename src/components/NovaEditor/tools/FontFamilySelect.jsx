import { useRef } from "react"

/**
 * FontFamilySelect
 *
 * A styled <select> that fits inside the sub-toolbar.
 * Selecting a value immediately applies the fontFamily mark.
 */

export const FONT_FAMILIES = [
  { label: "Default",          value: ""                                        },
  { label: "System UI",        value: "system-ui, sans-serif"                   },
  { label: "Serif",            value: "Georgia, 'Times New Roman', serif"       },
  { label: "Mono",             value: "'JetBrains Mono', 'Courier New', mono"   },
  { label: "Syne",             value: "'Syne', sans-serif"                      },
  { label: "Inter",            value: "Inter, sans-serif"                       },
  { label: "Helvetica",        value: "Helvetica, Arial, sans-serif"            },
  { label: "Georgia",          value: "Georgia, serif"                          },
  { label: "Courier New",      value: "'Courier New', Courier, monospace"       },
  { label: "Impact",           value: "Impact, Haettenschweiler, sans-serif"    },
]

const FontFamilySelect = ({ value = "", onChange }) => {
  const selectRef = useRef(null)

  const handleChange = (e) => {
    e.preventDefault()
    onChange(e.target.value || null)
    // Blur so focus returns to editor
    setTimeout(() => selectRef.current?.blur(), 0)
  }

  return (
    <div className="ne-font-select-wrap" title="Font family">
      <select
        ref={selectRef}
        className="ne-font-select"
        value={value || ""}
        onChange={handleChange}
        aria-label="Font family"
        onMouseDown={e => e.stopPropagation()} // prevent sub-toolbar close
      >
        {FONT_FAMILIES.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
    </div>
  )
}

export default FontFamilySelect
