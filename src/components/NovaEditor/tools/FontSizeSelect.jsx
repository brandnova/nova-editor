import { useRef } from "react"

/**
 * FontSizeSelect
 *
 * A styled <select> for font size. Values are px strings.
 */

export const FONT_SIZES = [
  { label: "Default", value: ""     },
  { label: "10",      value: "10px" },
  { label: "12",      value: "12px" },
  { label: "14",      value: "14px" },
  { label: "16",      value: "16px" },
  { label: "18",      value: "18px" },
  { label: "20",      value: "20px" },
  { label: "24",      value: "24px" },
  { label: "28",      value: "28px" },
  { label: "32",      value: "32px" },
  { label: "40",      value: "40px" },
  { label: "48",      value: "48px" },
  { label: "64",      value: "64px" },
]

const FontSizeSelect = ({ value = "", onChange }) => {
  const selectRef = useRef(null)

  const handleChange = (e) => {
    e.preventDefault()
    onChange(e.target.value || null)
    setTimeout(() => selectRef.current?.blur(), 0)
  }

  return (
    <div className="ne-font-select-wrap ne-font-select-wrap--size" title="Font size">
      <select
        ref={selectRef}
        className="ne-font-select ne-font-select--size"
        value={value || ""}
        onChange={handleChange}
        aria-label="Font size"
        onMouseDown={e => e.stopPropagation()}
      >
        {FONT_SIZES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  )
}

export default FontSizeSelect
