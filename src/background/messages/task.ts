import type { TypeTextOptions } from "@/contents/type"
import { click, getHTML, navigate, scroll, typeText } from "@/lib/actionHelper"
import { Authenticate } from "@/lib/authenticate"
import { ping } from "@/lib/ping"
import { takeScreenshot } from "@/lib/screenshot"
import { sleep } from "@/lib/utils"

// import {z} from "zod"
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
    let tabId = window.tabs[0].id
    await ping(tabId)
    const response = await typeText(tabId, "#APjFqb", reqBody.prompt, "write")
    console.log(response)

    const navigation = await navigate(tabId, "https://x.com")
    console.log(navigation)

    await ping(tabId)

    await sleep(2000)
    const html = await getHTML(tabId)

    console.log(html)

    await sleep(1000)
    const scroll_down = await scroll(tabId, "down")
    console.log(scroll_down)
    await sleep(1000)

    // const selector =
    //   "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf.emcav > div.RNNXgb > div > div.dRYYxd > div.XDyW0e"

    // const clickResponse = await click(tabId, selector)

    // console.log(clickResponse)

    res.send({ success: true, data: response })
  } catch (error) {
    // Log the error and send a failure response
    console.error("Error in message handler:", error)
    res.send({ success: false, error: error.message })
  }
}

export default handler
