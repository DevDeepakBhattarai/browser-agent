import { click, getHTML, scroll, wait } from "@/lib/actionHelper"
import { agentAPI } from "@/lib/agent"
import { Authenticate } from "@/lib/authenticate"
import { attachDebugger, detachDebugger } from "@/lib/chromeDebugger"
import { navigate } from "@/lib/navigate"
import { ping } from "@/lib/ping"
import { takeScreenshot } from "@/lib/screenshot"
import { search } from "@/lib/search"
import { typeText } from "@/lib/type"
import { formatActions } from "@/lib/utils"

// import {z} from "zod"
import { type PlasmoMessaging } from "@plasmohq/messaging"

type WebsiteMessageData = {
  objective: string
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
    let actions_completed: string
    const initialAction = await agentAPI.initialAction(reqBody.objective, "gpt")
    let requestNumber = 0
    let nextAction

    res.send({ success: true })

    switch (initialAction.operation) {
      case "search": {
        window = await search(initialAction.search_term)
        tabId = window.tabs[0].id
        await ping(tabId)
        await wait(tabId)
        actions_completed = formatActions([initialAction], actions_completed)
        break
      }
      case "navigate_to": {
        window = await chrome.windows.create({
          url: initialAction.url,
          type: "popup"
        })
        tabId = window.tabs[0].id
        await ping(tabId)
        await wait(tabId)
        actions_completed = formatActions([initialAction], actions_completed)
        break
      }
    }

    await detachDebugger(tabId)
    try {
      await attachDebugger(tabId)
    } catch (e) {
      res.send({
        success: false,
        message:
          "You have an incompatible extension installed. Remove any extension that adds additional stuff in the website"
      })
    }

    const screenshot = await takeScreenshot(window.id)
    const { html } = await getHTML(tabId)

    console.log(screenshot, html)
    while (nextAction) {
      const screenshot = await takeScreenshot(window.id)
      const { html } = await getHTML(tabId)

      console.log(screenshot, html)
      requestNumber++

      nextAction = await agentAPI.action(
        [screenshot],
        html,
        reqBody.objective,
        "gpt",
        actions_completed
      )

      for (const action of nextAction) {
        console.log("Next Action", nextAction)
        switch (action.operation) {
          case "navigate_to": {
            await navigate(tabId, action.url)
            await ping(tabId)
            await wait(tabId)
            actions_completed = formatActions(action, actions_completed)

            break
          }
          case "type": {
            await typeText(tabId, action.text)
            actions_completed = formatActions(action, actions_completed)

            break
          }
          case "click": {
            await click(tabId, `[data-id="${action.data_id}"]`)
            actions_completed = formatActions(action, actions_completed)

            break
          }
          case "content_writing": {
            const response = await agentAPI.content(action.instruction, "gpt")
            actions_completed = formatActions(
              action,
              actions_completed,
              response.content
            )

            break
          }
          case "scroll_down": {
            await scroll(tabId, "down")
            actions_completed = formatActions(action, actions_completed)

            break
          }

          case "scroll_up": {
            await scroll(tabId, "up")
            actions_completed = formatActions(action, actions_completed)
            break
          }
          case "search": {
            window = await search(action.search_term)
            tabId = window.tabs[0].id
            await ping(tabId)
            await wait(tabId)
            actions_completed = formatActions(action, actions_completed)
            break
          }
          case "done": {
            console.log("The task has been completed")
            break
          }
        }
      }
    }
  } catch (error) {
    // Log the error and send a failure response
    console.error("Error in message handler:", error)
    res.send({ success: false, error: error.message })
  }
}

export default handler
