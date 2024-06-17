import {
  actionSchema,
  click,
  getInteractiveElements,
  getTextFromPage,
  scroll
} from "@/lib/actionHelper"
import { Authenticate } from "@/lib/actions/authenticate"
import { navigate } from "@/lib/actions/navigate"
import { ping } from "@/lib/actions/ping"
import { takeScreenshot } from "@/lib/actions/screenshot"
import { search } from "@/lib/actions/search"
import { typeText } from "@/lib/actions/type"
import { wait } from "@/lib/actions/wait"
import { agentAPI } from "@/lib/agent"
import { attachDebugger, detachDebugger } from "@/lib/chromeDebugger"
import { formatActions, sleep } from "@/lib/utils"
import type { z } from "zod"

import { type PlasmoMessaging } from "@plasmohq/messaging"

const MODEL = "gpt"

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
    let actions_completed = ""
    let requestNumber = 0
    let nextAction: z.infer<typeof actionSchema>
    let isObjectiveComplete: boolean = false

    const initialAction = await agentAPI.initialAction(reqBody.objective, MODEL)
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

    while (!isObjectiveComplete) {
      const screenshot = await takeScreenshot(window.id)
      const { html } = await getInteractiveElements(tabId)

      console.log(screenshot, html)
      requestNumber++

      nextAction = await agentAPI.action(
        [screenshot],
        html,
        reqBody.objective,
        MODEL,
        actions_completed
      )
      console.log("Next Action", nextAction)

      for (const action of nextAction) {
        console.log(action.thought)
        switch (action.operation) {
          case "navigate_to": {
            await navigate(tabId, action.url)
            await ping(tabId)
            await wait(tabId)
            actions_completed = formatActions([action], actions_completed)
            break
          }

          case "type": {
            await typeText(tabId, action.text)
            actions_completed = formatActions([action], actions_completed)
            break
          }
          case "gather_information_from_page": {
            const { page_content } = await getTextFromPage(tabId)
            const response = await agentAPI.gatherInformationFromPage(
              action.instruction,
              page_content
            )
            const page_data = response.is_data_available
              ? response.page_data
              : "NO_INFORMATION"

            actions_completed = formatActions(
              [action],
              actions_completed,
              page_data
            )
            break
          }
          case "click": {
            await click(tabId, `[data-id="${action.data_id}"]`)
            actions_completed = formatActions([action], actions_completed)
            await sleep(2000)
            break
          }

          case "content_writing": {
            const response = await agentAPI.content(action.instruction, MODEL)
            actions_completed = formatActions(
              [action],
              actions_completed,
              response.content
            )

            break
          }
          case "scroll": {
            await scroll(tabId, action.direction)
            actions_completed = formatActions(
              [action],
              actions_completed,
              action.content
            )
            break
          }

          case "search": {
            window = await search(action.search_term)
            tabId = window.tabs[0].id
            await ping(tabId)
            await wait(tabId)
            actions_completed = formatActions([action], actions_completed)
            break
          }
          case "done": {
            console.log("The task has been completed")
            isObjectiveComplete = true
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
