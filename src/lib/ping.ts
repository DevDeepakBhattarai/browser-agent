import { sendToContentScript } from "@plasmohq/messaging"

import { sleep } from "./utils"

export async function ping(tabId: number) {
  let initialResponse
  const timeout = 10000 // 10 seconds
  const interval = 100 // Retry interval of 100ms
  const startTime = Date.now()

  // Keep retrying until the initial response is ready or timeout is reached
  while (true) {
    try {
      initialResponse = await sendToContentScript({
        tabId,
        body: { name: "ping", message: "Hello there mate ?" },
        name: "ping"
      })

      if (initialResponse) {
        break
      }
    } catch (e) {
      console.error("Error during initial sendToContentScript call:", e)
    }

    // Check if timeout has been reached
    if (Date.now() - startTime >= timeout) {
      throw new Error(
        "Failed to get a ready initial response within 10 seconds."
      )
    }

    // Wait for the retry interval before retrying
    await sleep(interval)
  }

  return
}
