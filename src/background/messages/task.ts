import type { TypeTextOptions } from "@/contents/type"
import { click, getHTML, scroll, typeText, wait } from "@/lib/actionHelper"
import { agentAPI } from "@/lib/agent"
import { Authenticate } from "@/lib/authenticate"
import { navigate } from "@/lib/navigate"
import { ping } from "@/lib/ping"
import { takeScreenshot } from "@/lib/screenshot"
import { search } from "@/lib/search"
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
    let window: chrome.windows.Window
    let tabId: number
    let completedSteps = []
    const { plan, action } = await agentAPI.plan(reqBody.prompt, "gpt")

    if (action && "goto" in action) {
      window = await chrome.windows.create({
        url: action.goto,
        type: "popup"
      })
      tabId = window.tabs[0].id
      await ping(tabId)
      await wait(tabId)
    }

    if (action && "search" in action) {
      window = await search(action.search)
      tabId = window.tabs[0].id
      await ping(tabId)
      await wait(tabId)
    }

    const screenshot = await takeScreenshot(window.id)
    const { html } = await getHTML(tabId)

    let index = 0
    while (completedSteps.length !== plan.length) {
      const nextAction = await agentAPI.action(
        [screenshot],
        html,
        reqBody.prompt,
        "gpt",
        plan[index],
        completedSteps
      )

      if ("goto" in nextAction) {
        await navigate(tabId, nextAction.goto)
        await ping(tabId)
        await wait(tabId)
      }

      if ("type" in nextAction) {
        await typeText(
          tabId,
          nextAction.type.selector,
          nextAction.type.content,
          "paste"
        )
      }

      if ("click" in nextAction) {
        await click(tabId, nextAction.click)
      }

      if ("content_writing" in nextAction) {
        const response = await agentAPI.content(
          nextAction.content_writing.instruction,
          "gpt"
        )
        await typeText(
          tabId,
          nextAction.content_writing.selector,
          response.content,
          "paste"
        )
      }
      if ("scroll_up" in nextAction) {
        await scroll(tabId, "up")
      }
      if ("scroll_down" in nextAction) {
        await scroll(tabId, "down")
      }

      if ("completed" in nextAction) {
        completedSteps.push(plan[index])
        index++
      }
    }
    res.send({ success: true })
  } catch (error) {
    // Log the error and send a failure response
    console.error("Error in message handler:", error)
    res.send({ success: false, error: error.message })
  }
}

export default handler
