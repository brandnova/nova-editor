import { useState } from "react"
import { Link, ImageIcon, Omega, Smile } from "lucide-react"
import LinkTool     from "./LinkTool"
import ImageTool    from "./ImageTool"
import SpecialChars from "./SpecialChars"
import EmojiPicker  from "./EmojiPicker"

/**
 * InsertPanel
 *
 * Renders inside the Insert sub-toolbar. Shows a row of tool selector
 * buttons at the top, with only the selected tool's UI visible below.
 * Defaults to whichever tools are configured — if only "link" and "image"
 * are in the preset, only those two selector buttons appear.
 */

const TOOL_DEFS = [
  { key: "link",         label: "Link",             Icon: Link      },
  { key: "image",        label: "Image",            Icon: ImageIcon },
  { key: "specialChars", label: "Special Chars",    Icon: Omega     },
  { key: "emoji",        label: "Emoji",            Icon: Smile     },
]

const InsertPanel = ({ tools = [], onClose, editor, savedSelectionRef }) => {
  // Only show tabs for tools that are configured in this preset
  const activeDefs = TOOL_DEFS.filter(d => tools.includes(d.key))

  const [selected, setSelected] = useState(
    activeDefs.length > 0 ? activeDefs[0].key : null
  )

  if (activeDefs.length === 0) return null

  const renderTool = () => {
    switch (selected) {
      case "link":
        return (
          <LinkTool
            onClose={onClose}
            editor={editor}
            savedSelectionRef={savedSelectionRef}
          />
        )
      case "image":
        return (
          <ImageTool
            onClose={onClose}
            editor={editor}
            savedSelectionRef={savedSelectionRef}
          />
        )
      case "specialChars": return <SpecialChars />
      case "emoji":        return <EmojiPicker  />
      default:             return null
    }
  }

  return (
    <div className="ne-insert-panel" onMouseDown={e => e.stopPropagation()}>
      {/* Tool selector tabs */}
      <div className="ne-insert-tabs" role="tablist" aria-label="Insert tools">
        {activeDefs.map(def => {
          const { Icon } = def
          const isActive = selected === def.key
          return (
            <button
              key={def.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={def.label}
              title={def.label}
              className={`ne-insert-tab${isActive ? " ne-insert-tab--active" : ""}`}
              onMouseDown={e => {
                e.preventDefault()
                setSelected(def.key)
              }}
            >
              <Icon />
              <span className="ne-insert-tab-label">{def.label}</span>
            </button>
          )
        })}
      </div>

      {/* Active tool content */}
      <div className="ne-insert-tool-content" role="tabpanel">
        {renderTool()}
      </div>
    </div>
  )
}

export default InsertPanel
