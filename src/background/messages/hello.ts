import { sendMessageToContentScript } from "@/lib/sendMessageToContentScript"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const window = await chrome.windows.create({
      url: "https://google.com",
      type: "popup"
    })
    const tabId = window.tabs[0].id
    console.log(`Tab ID: ${tabId}`)

    // Adding detailed logging before and after the message sending
    console.log("Sending message to content script...")
    const response = await sendMessageToContentScript({
      tabId: tabId,
      body: { type: "TASK", message: "This is the actual message for you" },
      name: "index"
    })

    // Log the response to see if it's received correctly
    console.log("Response from content script:", response)

    // Send the response back
    res.send({ success: true, data: response })
  } catch (error) {
    // Log the error and send a failure response
    console.error("Error in message handler:", error)
    res.send({ success: false, error: error.message })
  }
}

export default handler
