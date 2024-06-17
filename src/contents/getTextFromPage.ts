import { listen } from "@plasmohq/messaging/message"

type ReqData = { name: string }
listen((req, res) => {
  const reqData = req.body as ReqData
  if (reqData.name !== "getTextFromPage") return

  function getPageTextContent() {
    const excludedTags = [
      "NAV",
      "ASIDE",
      "HEADER",
      "FOOTER",
      "SCRIPT",
      "STYLE",
      "NOSCRIPT",
      "LINK",
      "META",
      "TITLE",
      "BASE",
      "TEMPLATE"
    ]
    const blockLevelTags = [
      "ADDRESS",
      "ARTICLE",
      "BLOCKQUOTE",
      "DD",
      "DIV",
      "DL",
      "DT",
      "FIELDSET",
      "FIGCAPTION",
      "FIGURE",
      "FOOTER",
      "FORM",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "LI",
      "MAIN",
      "OL",
      "P",
      "PRE",
      "SECTION",
      "TABLE",
      "TFOOT",
      "UL"
    ]
    let textContent = ""

    function convertTableToMarkdown(tableElement) {
      let markdown = ""

      const rows = tableElement.querySelectorAll("tr") as HTMLTableRowElement[]
      if (rows.length === 0) return markdown

      // Extract headers
      const headers = rows[0].querySelectorAll("th, td")
      if (headers.length > 0) {
        const headerText = Array.from(headers).map((th) =>
          th.textContent.trim()
        )
        markdown += "| " + headerText.join(" | ") + " |\n"
        markdown += "| " + headerText.map(() => "---").join(" | ") + " |\n"
      }

      // Extract body rows
      Array.from(rows)
        .slice(1)
        .forEach((row) => {
          const cells = row.querySelectorAll("th, td")
          const cellText = Array.from(cells).map((td) => td.textContent.trim())
          markdown += "| " + cellText.join(" | ") + " |\n"
        })

      return markdown
    }

    function collectText(node, addNewLine) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (excludedTags.includes(node.tagName)) {
          return
        }
        if (node.tagName === "TABLE") {
          textContent += convertTableToMarkdown(node) + "\n"
          return
        }
        if (blockLevelTags.includes(node.tagName) && addNewLine) {
          textContent = textContent.trim() + "\n"
        }
      }
      if (node.nodeType === Node.TEXT_NODE) {
        textContent += node.textContent.trim() + " "
      }
      node.childNodes.forEach((child) =>
        collectText(child, blockLevelTags.includes(node.tagName))
      )
    }

    collectText(document.body, false)

    return textContent.trim()
  }

  const pageTextContent = getPageTextContent()
  console.log(pageTextContent)
  res.send({ page_content: pageTextContent })
})
