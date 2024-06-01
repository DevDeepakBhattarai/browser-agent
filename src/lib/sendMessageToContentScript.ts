import { sendToContentScript } from "@plasmohq/messaging"

import { sleep } from "./utils"

interface Arguments {
  tabId: number
  body: Record<string, any>
  name: string
  [key: string]: any
}

export async function sendMessageToContentScript({
  tabId,
  body,
  name,
  ...args
}: Arguments): Promise<Record<string, string>> {
  let initialResponse
  const timeout = 10000 // 10 seconds
  const interval = 100 // Retry interval of 100ms
  const startTime = Date.now()

  // Keep retrying until the initial response is ready or timeout is reached
  while (true) {
    try {
      initialResponse = await sendToContentScript({
        tabId,
        body: { type: "PING", message: "Hello there mate ?" },
        name: "ping",
        ...args
      })
      console.log("Initial response:", initialResponse)

      if (initialResponse) {
        break
      } else {
        console.warn("Initial response not ready, retrying...")
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

  // Proceed with sending the final message
  try {
    const response = await sendToContentScript({
      tabId,
      body,
      name,
      ...args
    })
    console.log("Final response:", response)
    return response
  } catch (e) {
    console.error("Error during final sendToContentScript call:", e)
    throw e // Re-throw the error to be caught in the outer try-catch
  }
}
