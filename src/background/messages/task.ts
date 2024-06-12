import type { TypeTextOptions } from "@/contents/type"
import { Authenticate } from "@/lib/authenticate"
import { ping } from "@/lib/ping"
import { takeScreenshot } from "@/lib/screenshot"

import { sendToContentScript, type PlasmoMessaging } from "@plasmohq/messaging"

type WebsiteMessageData = {
  prompt: string
  type: "write" | "paste"
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const reqBody = req.body as WebsiteMessageData

  try {
    const response = await Authenticate()
    console.log(response)
  } catch (e) {
    console.error(e)
    res.send({ message: "You are not authorized", success: false })
    return
  }

  try {
    const window = await chrome.windows.create({
      url: "https://google.com",
      type: "popup"
    })
    const tabId = window.tabs[0].id

    try {
      await ping(tabId)
      console.log("Initial Response Done !")
    } catch (e) {
      console.log(e)
      res.send({
        success: false,
        message: "Script could not be loaded in the browser"
      })
      return
    }

    const response = await sendToContentScript({
      name: "type",
      tabId,
      body: {
        selector: "#APjFqb",
        text: reqBody.prompt,
        type: reqBody.type,
        name: "type"
      } as TypeTextOptions
    })
    console.log(response)

    const screenshot = await takeScreenshot({
      type: "fullpage",
      windowId: window.id
    })
    console.log(screenshot)

    const html = await sendToContentScript({
      tabId,
      body: {
        name: "getHTML"
      },
      name: "getHTML"
    })
    console.log(html)

    res.send({ success: true, data: response })
  } catch (error) {
    // Log the error and send a failure response
    console.error("Error in message handler:", error)
    res.send({ success: false, error: error.message })
  }
}

export default handler
