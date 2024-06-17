import { sleep } from "../utils"

export async function typeText(
  tabId: number,
  text: string,
  typingSpeed: number = 10
) {
  for (const char of text) {
    await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
      type: "keyDown",
      text: char
    })
    await sleep(typingSpeed)
    await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
      type: "keyUp",
      text: char
    })
    await sleep(typingSpeed)
  }
}
