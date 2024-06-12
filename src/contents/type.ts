import { sleep } from "@/lib/utils"

import { listen } from "@plasmohq/messaging/message"

listen(async (req, res) => {
  const reqData = req.body as TypeTextOptions & { name: string }
  if (reqData.name !== "type") return
  const hasTyped = await typeText(reqData)
  if (hasTyped) res.send({ success: true })
  else res.send({ success: false })
})
export type TypeTextOptions = {
  selector: string
  text: string
  type: "write" | "paste"
  typingSpeed?: number
}

async function typeText({
  selector,
  text,
  type = "write",
  typingSpeed = 100
}: TypeTextOptions) {
  // Find the input field using the provided selector
  const inputField = document.querySelector(selector) as
    | HTMLInputElement
    | HTMLTextAreaElement

  // Check if the input field exists
  if (!inputField) {
    console.error("Input field not found for selector:", selector)
    return false
  }

  inputField.focus()

  if (type === "write") {
    // Function to type each character with a delay
    for (let i = 0; i < text.length; i++) {
      inputField.value += text[i]
      // Dispatch an input event to simulate real typing
      inputField.dispatchEvent(new Event("input", { bubbles: true }))
      // Set a timeout to type the next character
      await sleep(typingSpeed) // Adjust typing speed here
    }
    // Start typing the text
    return true
  } else if (type === "paste") {
    // Directly set the value and dispatch a change event
    inputField.value = text
    inputField.dispatchEvent(new Event("input", { bubbles: true }))
    return true
  } else {
    console.error('Invalid type specified. Use "write" or "paste".')
    return false
  }
}
