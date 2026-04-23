/**
 * Markdown → Slate node parser.
 * Handles: headings, bold/italic/code/strikethrough inline,
 * blockquotes, bulleted & numbered lists, checklists,
 * fenced code blocks, horizontal rules, and markdown tables.
 */

// ── Inline formatting ─────────────────────────────────────────────────────────

const parseInlineFormatting = (text) => {
  const patterns = [
    { regex: /\*\*\*(.*?)\*\*\*/g, format: ["bold", "italic"] },
    { regex: /\*\*(.*?)\*\*/g,     format: ["bold"] },
    { regex: /__(.*?)__/g,         format: ["bold"] },
    { regex: /\*(.*?)\*/g,         format: ["italic"] },
    { regex: /_((?!_).*?)_/g,      format: ["italic"] },
    { regex: /~~(.*?)~~/g,         format: ["strikethrough"] },
    { regex: /`([^`]+)`/g,         format: ["code"] },
  ]

  const matches = []
  patterns.forEach(({ regex, format }) => {
    const re = new RegExp(regex.source, regex.flags)
    let m
    while ((m = re.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, text: m[1], format })
    }
  })

  matches.sort((a, b) => a.start - b.start)

  // Remove overlapping matches — keep the one that starts first
  const valid = []
  matches.forEach((m) => {
    if (!valid.some((v) => m.start < v.end && m.end > v.start)) valid.push(m)
  })

  if (valid.length === 0) return [{ text }]

  const result = []
  let cur = 0
  valid.forEach((m) => {
    if (m.start > cur) result.push({ text: text.slice(cur, m.start) })
    const node = { text: m.text }
    m.format.forEach((f) => (node[f] = true))
    result.push(node)
    cur = m.end
  })
  if (cur < text.length) result.push({ text: text.slice(cur) })

  return result.filter((n) => n.text !== "")
}

// ── Table parser ──────────────────────────────────────────────────────────────
// Correctly handles:
//   - Cells with colons (alignment row)
//   - Empty cells (|  |  |)
//   - Leading/trailing pipe characters or lack thereof
//   - Inline formatting inside cells

const splitTableRow = (line) => {
  // Strip optional leading and trailing pipe, then split on |
  const stripped = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "")
  return stripped.split("|").map((c) => c.trim())
}

const isSeparatorRow = (line) =>
  /^\s*\|?[\s\-|:]+\|?\s*$/.test(line) &&
  line.includes("-")

const parseTable = (lines, startIndex) => {
  if (startIndex + 1 >= lines.length) return null

  const headerLine = lines[startIndex]
  const sepLine    = lines[startIndex + 1]

  if (!headerLine.includes("|") || !isSeparatorRow(sepLine)) return null

  const headers  = splitTableRow(headerLine)
  const colCount = headers.length
  if (colCount === 0) return null

  // Header node — children are table-cell nodes with header:true
  const headerNode = {
    type: "table-header",
    children: headers.map((h) => ({
      type:     "table-cell",
      header:   true,
      children: parseInlineFormatting(h) || [{ text: h }],
    })),
  }

  let i = startIndex + 2
  const bodyRows = []

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line.includes("|") || line === "") break

    const cells   = splitTableRow(lines[i])
    // Pad or trim to match column count
    while (cells.length < colCount) cells.push("")
    const trimmed = cells.slice(0, colCount)

    bodyRows.push({
      type: "table-row",
      children: trimmed.map((c) => ({
        type:     "table-cell",
        header:   false,
        children: parseInlineFormatting(c) || [{ text: c }],
      })),
    })
    i++
  }

  // Wrap body rows in a table-body node for correct thead/tbody HTML structure
  const tableChildren = [headerNode]
  if (bodyRows.length > 0) {
    tableChildren.push({ type: "table-body", children: bodyRows })
  }

  return {
    nodes: [{ type: "table", children: tableChildren }],
    linesConsumed: i - startIndex,
  }
}

// ── Main parser ───────────────────────────────────────────────────────────────

export const parseMarkdown = (text) => {
  const lines  = text.split("\n")
  const result = []
  let inCode   = false
  let codeLang = ""
  let codeAcc  = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith("```")) {
      if (inCode) {
        result.push({ type: "code-block", language: codeLang, children: [{ text: codeAcc.join("\n") }] })
        inCode = false; codeLang = ""; codeAcc = []
      } else {
        inCode = true; codeLang = line.slice(3).trim() || "text"
      }
      i++; continue
    }
    if (inCode) { codeAcc.push(line); i++; continue }

    // Table detection — check if this line and next look like a table
    if (line.includes("|")) {
      const ahead = lines[i + 1] || ""
      if (isSeparatorRow(ahead)) {
        const t = parseTable(lines, i)
        if (t) { result.push(...t.nodes); i += t.linesConsumed; continue }
      }
    }

    // Block elements
    const trimmed = line.trim()
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      result.push({ type: "horizontal-rule", children: [{ text: "" }] })
    } else if (line.startsWith("#### ")) {
      // H4 → H3 (Slate only has 3 heading levels)
      result.push({ type: "heading-three", children: parseInlineFormatting(line.slice(5)) })
    } else if (line.startsWith("### ")) {
      result.push({ type: "heading-three", children: parseInlineFormatting(line.slice(4)) })
    } else if (line.startsWith("## ")) {
      result.push({ type: "heading-two",   children: parseInlineFormatting(line.slice(3)) })
    } else if (line.startsWith("# ")) {
      result.push({ type: "heading-one",   children: parseInlineFormatting(line.slice(2)) })
    } else if (line.startsWith("> ")) {
      result.push({ type: "block-quote",   children: parseInlineFormatting(line.slice(2)) })
    } else if (line.startsWith("- [ ] ") || line.startsWith("- [x] ") || line.startsWith("- [X] ")) {
      const checked = !line.startsWith("- [ ] ")
      result.push({ type: "check-item", checked, children: parseInlineFormatting(line.slice(6)) })
    } else if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("+ ")) {
      result.push({ type: "list-item", children: parseInlineFormatting(line.slice(2)) })
    } else if (/^\d+\.\s/.test(line)) {
      result.push({ type: "list-item", children: parseInlineFormatting(line.replace(/^\d+\.\s/, "")) })
    } else if (trimmed === "") {
      result.push({ type: "paragraph", children: [{ text: "" }] })
    } else {
      result.push({ type: "paragraph", children: parseInlineFormatting(line) })
    }

    i++
  }

  // Close unclosed code block
  if (inCode && codeAcc.length > 0) {
    result.push({ type: "code-block", language: codeLang, children: [{ text: codeAcc.join("\n") }] })
  }

  return result.length > 0 ? result : [{ type: "paragraph", children: [{ text: "" }] }]
}
