import { sendMessageToContentScript } from "@/lib/sendMessageToContentScript"
import type { TypeTextOptions } from "@/lib/type"

import type { PlasmoMessaging } from "@plasmohq/messaging"

type WebsiteMessageData = {
  prompt: string
  type: "write" | "paste"
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const reqBody = req.body as WebsiteMessageData
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
      body: {
        selector: "#APjFqb",
        text: reqBody.prompt,
        type: reqBody.type
      } as TypeTextOptions,
      name: "type"
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
