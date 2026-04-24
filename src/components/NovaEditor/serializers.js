import { Text } from "slate"

// ── Slate → HTML (raw) ────────────────────────────────────────────────────────

const serializeNode = (node) => {
  if (Text.isText(node)) {
    let t = node.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
    if (node.bold)          t = `<strong>${t}</strong>`
    if (node.italic)        t = `<em>${t}</em>`
    if (node.underline)     t = `<u>${t}</u>`
    if (node.strikethrough) t = `<del>${t}</del>`
    if (node.code)          t = `<code>${t}</code>`
    return t
  }

  const children = node.children?.map(serializeNode).join("") ?? ""
  const align    = node.align ? ` style="text-align:${node.align}"` : ""

  switch (node.type) {
    case "paragraph":       return children.trim() ? `<p${align}>${children}</p>` : ""
    case "heading-one":     return `<h1${align}>${children}</h1>`
    case "heading-two":     return `<h2${align}>${children}</h2>`
    case "heading-three":   return `<h3${align}>${children}</h3>`
    case "block-quote":     return `<blockquote>${children}</blockquote>`
    case "bulleted-list":   return `<ul>${children}</ul>`
    case "numbered-list":   return `<ol>${children}</ol>`
    case "list-item":       return `<li>${children}</li>`
    case "check-item":      return `<li class="ne-check-item"><input type="checkbox"${node.checked ? " checked" : ""} readonly> ${children}</li>`
    case "code-block":      return `<pre><code class="language-${node.language || "text"}">${children}</code></pre>`
    case "horizontal-rule": return "<hr>"
    case "table":           return `<table>${children}</table>`
    case "table-header":    return `<thead><tr>${children}</tr></thead>`
    case "table-body":      return `<tbody>${children}</tbody>`
    case "table-row":       return `<tr>${children}</tr>`
    case "table-cell":      return node.header ? `<th>${children}</th>` : `<td>${children}</td>`
    default:                return children.trim() ? `<p>${children}</p>` : ""
  }
}

// ── HTML pretty-printer ───────────────────────────────────────────────────────
// Walks the raw HTML string and adds newlines + 2-space indentation.
// Inline elements (strong, em, u, del, code, a, span) are never broken.

const INLINE_TAGS = new Set(["strong","em","u","del","code","a","span","abbr","small","b","i","s"])
const VOID_TAGS   = new Set(["hr","br","img","input","meta","link"])

const indentHTML = (html) => {
  if (!html.trim()) return ""

  const result = []
  let depth    = 0
  let i        = 0
  const indent = () => "  ".repeat(depth)

  while (i < html.length) {
    if (html[i] !== "<") {
      // Text node — emit inline, no newline prefix
      let end = html.indexOf("<", i)
      if (end === -1) end = html.length
      const text = html.slice(i, end).trim()
      if (text) result.push(text)
      i = end
      continue
    }

    // Find end of tag
    const tagEnd = html.indexOf(">", i)
    if (tagEnd === -1) { i++; continue }

    const tag = html.slice(i, tagEnd + 1)
    i = tagEnd + 1

    // Closing tag?
    if (tag.startsWith("</")) {
      const name = tag.match(/<\/(\w+)/)?.[1]?.toLowerCase()
      if (!INLINE_TAGS.has(name)) {
        depth = Math.max(0, depth - 1)
        result.push(`\n${indent()}${tag}`)
      } else {
        result.push(tag)
      }
      continue
    }

    // Self-closing or void?
    const name     = tag.match(/<(\w+)/)?.[1]?.toLowerCase()
    const isVoid   = VOID_TAGS.has(name) || tag.endsWith("/>")
    const isInline = INLINE_TAGS.has(name)

    if (isInline) {
      result.push(tag)
    } else {
      result.push(`\n${indent()}${tag}`)
      if (!isVoid) depth++
    }
  }

  return result.join("").trim()
}

export const serializeToHTML = (nodes) => {
  const raw = nodes.map(serializeNode).join("")
  return indentHTML(raw)
}

// ── HTML → Slate parser ───────────────────────────────────────────────────────

const parseInlineHTML = (element) => {
  const result = []
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent) result.push({ text: node.textContent })
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const inner = parseInlineHTML(node)
      const tag   = node.tagName.toLowerCase()
      inner.forEach((child) => {
        if (Text.isText(child)) {
          result.push({
            ...child,
            bold:          (tag === "strong" || tag === "b") ? true : child.bold,
            italic:        (tag === "em"     || tag === "i") ? true : child.italic,
            underline:     tag === "u"                        ? true : child.underline,
            strikethrough: (tag === "del"    || tag === "s") ? true : child.strikethrough,
            code:          tag === "code"                     ? true : child.code,
          })
        } else {
          result.push(child)
        }
      })
    }
  }
  return result.length > 0 ? result : [{ text: "" }]
}

const parseHTMLElement = (el) => {
  const tag = el.tagName?.toLowerCase()
  if (!tag) return null

  switch (tag) {
    case "h1": return { type: "heading-one",   children: parseInlineHTML(el) }
    case "h2": return { type: "heading-two",   children: parseInlineHTML(el) }
    case "h3": return { type: "heading-three", children: parseInlineHTML(el) }
    case "blockquote": return { type: "block-quote", children: parseInlineHTML(el) }
    case "hr": return { type: "horizontal-rule", children: [{ text: "" }] }
    case "pre": {
      const code = el.querySelector("code")
      const lang = (code?.className || "").replace("language-", "") || "text"
      return { type: "code-block", language: lang, children: [{ text: code?.textContent || el.textContent }] }
    }
    case "ul": {
      const items = Array.from(el.querySelectorAll(":scope > li")).map(li =>
        ({ type: "list-item", children: parseInlineHTML(li) })
      )
      return { type: "bulleted-list", children: items }
    }
    case "ol": {
      const items = Array.from(el.querySelectorAll(":scope > li")).map(li =>
        ({ type: "list-item", children: parseInlineHTML(li) })
      )
      return { type: "numbered-list", children: items }
    }
    case "table": {
      const tableChildren = []
      const thead = el.querySelector("thead")
      const tbody = el.querySelector("tbody")
      if (thead) {
        const headerCells = Array.from(thead.querySelectorAll("th")).map(th => ({
          type: "table-cell", header: true, children: [{ text: th.textContent }],
        }))
        tableChildren.push({ type: "table-header", children: headerCells })
      }
      if (tbody) {
        const rows = Array.from(tbody.querySelectorAll("tr")).map(tr => {
          const cells = Array.from(tr.querySelectorAll("td")).map(td => ({
            type: "table-cell", header: false, children: [{ text: td.textContent }],
          }))
          return { type: "table-row", children: cells }
        }).filter(r => r.children.length > 0)
        if (rows.length > 0) tableChildren.push({ type: "table-body", children: rows })
      }
      return tableChildren.length > 0 ? { type: "table", children: tableChildren } : null
    }
    default: {
      const styleAttr  = el.getAttribute("style") || ""
      const alignMatch = styleAttr.match(/text-align:\s*(\w+)/)
      const align      = alignMatch ? alignMatch[1] : undefined
      const children   = parseInlineHTML(el)
      return align ? { type: "paragraph", align, children } : { type: "paragraph", children }
    }
  }
}

export const parseHTMLToSlate = (html) => {
  if (!html?.trim()) return [{ type: "paragraph", children: [{ text: "" }] }]
  const div = document.createElement("div")
  div.innerHTML = html
  const nodes = Array.from(div.children).map(parseHTMLElement).filter(Boolean)
  return nodes.length > 0 ? nodes : [{ type: "paragraph", children: [{ text: "" }] }]
}
