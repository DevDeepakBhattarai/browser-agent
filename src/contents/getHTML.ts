import { listen } from "@plasmohq/messaging/message"

type ReqData = { name: string }
listen((req, res) => {
  const reqData = req.body as ReqData
  if (reqData.name !== "getHTML") return

  const elements = document.querySelectorAll(
    "button, a, textarea, input, [role=menuitem], [role=button], [role=textbox], [role=option], [contenteditable=true]"
  )

  // Counter for generating unique interactive IDs
  let interactiveIdCounter = 0

  // Convert NodeList to array and process each element
  const elementsArray = Array.from(elements)
    .map((el) => {
      if (!isElementVisible(el)) return
      // Increment the counter to generate a new unique ID
      interactiveIdCounter++
      const interactiveId = `${interactiveIdCounter}`
      let extraAttribute = ""

      // Add the interactive-id attribute
      el.setAttribute("data-interactive-id", interactiveId)

      // Get the text content
      const textContent = el.textContent || ""

      if (
        el.tagName.toLowerCase() === "input" ||
        el.tagName.toLowerCase() === "textarea"
      ) {
        let typeableElement = el as HTMLInputElement | HTMLTextAreaElement
        let placeholderValue = typeableElement.placeholder
        let value = typeableElement.value
        if (placeholderValue) {
          extraAttribute += `placeholder="${placeholderValue}")`
        }
        if (value) {
          extraAttribute += ` value="${value}"`
        }
      }

      const ariaLabel = el.getAttribute("aria-label")
      if (ariaLabel) {
        extraAttribute += ` aria-label="${ariaLabel}"`
      }

      const title = el.getAttribute("title")
      if (title) {
        extraAttribute += ` title="${title}"`
      }

      const role = el.getAttribute("role")
      if (role) {
        extraAttribute += ` role="${role}"`
      }

      // Return the element with only the interactive-id attribute and its text content
      return `<${el.tagName.toLowerCase()} ${extraAttribute} data-interactive-id="${interactiveId}">${textContent}</${el.tagName.toLowerCase()}>`
    })
    .filter((el) => el)
  // Join the array elements to form the final string
  const html = elementsArray.join("\n")
  res.send({ html: html.toString(), success: true })
})

function isElementVisible(el) {
  if (!el) return false // Element does not exist

  function isStyleVisible(el) {
    const style = window.getComputedStyle(el)
    return (
      style.width !== "0" &&
      style.height !== "0" &&
      style.opacity !== "0" &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    )
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  // Check if the element is visible style-wise
  if (!isStyleVisible(el)) {
    return false
  }

  // Traverse up the DOM and check if any ancestor element is hidden
  let parent = el
  while (parent) {
    if (!isStyleVisible(parent)) {
      return false
    }
    parent = parent.parentElement
  }

  // Finally, check if the element is within the viewport
  return isElementInViewport(el)
}
