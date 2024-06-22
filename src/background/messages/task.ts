import {
  actionHistorySchema,
  actionSchema,
  click,
  closeModal,
  getInteractiveElements,
  getTextFromPage,
  initialActionSchema,
  openModal,
  scroll,
  updateMessage
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
    let requestNumber = 0
    let nextAction: z.infer<typeof actionSchema>
    let actionSummary: string | undefined
    let isObjectiveComplete: boolean = false
    let fullActionsHistory: z.infer<typeof actionHistorySchema> = [] // Initialize an array to keep track of all actions

    const initialAction = await agentAPI.initialAction(reqBody.objective, MODEL)
    res.send({ success: true })

    switch (initialAction.operation) {
      case "search": {
        window = await search(initialAction.search_term)
        tabId = window.tabs[0].id
        await ping(tabId)
        await updateMessage(
          tabId,
          `I searched ${initialAction.search_term} on google`
        )
        await openModal(tabId)
        await wait(tabId)
        fullActionsHistory.push(initialAction)
        break
      }
      case "navigate_to": {
        window = await chrome.windows.create({
          url: initialAction.url,
          type: "popup",
          state: "maximized"
        })
        tabId = window.tabs[0].id
        await ping(tabId)
        await updateMessage(tabId, `I navigated to ${initialAction.url}`)
        await openModal(tabId)
        await wait(tabId)
        fullActionsHistory.push(initialAction)
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

    while (!isObjectiveComplete && requestNumber < 15) {
      await closeModal(tabId)
      await sleep(100)
      const screenshot = await takeScreenshot(window.id)
      const { html } = await getInteractiveElements(tabId)
      console.log(screenshot, html)
      await openModal(tabId)
      requestNumber++
      const completed_actions = formatActions(fullActionsHistory)
      console.log(actionSummary)
      const response = await agentAPI.action(
        [screenshot],
        html,
        reqBody.objective,
        MODEL,
        completed_actions,
        actionSummary
      )
      nextAction = response.action
      actionSummary = response.summary
      console.log("Next Action", nextAction)
      if (actionSummary) {
        fullActionsHistory.shift()
      }

      for (const action of nextAction) {
        console.log(action.thought)
        await updateMessage(tabId, action.thought)
        switch (action.operation) {
          case "navigate_to": {
            await navigate(tabId, action.url)
            await ping(tabId)
            await wait(tabId)
            fullActionsHistory.push(action)

            break
          }
          case "type": {
            await typeText(tabId, action.text)
            fullActionsHistory.push(action)

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

            fullActionsHistory.push({ ...action, result: page_data })
            await updateMessage(
              tabId,
              page_data !== "NO_INFORMATION"
                ? `I gathered the following information from the page ${page_data}`
                : "I could not find any information on the page"
            )
            break
          }
          case "click": {
            await click(tabId, `[data-id="${action.data_id}"]`)
            fullActionsHistory.push(action)
            await wait(tabId)
            break
          }
          case "content_writing": {
            const response = await agentAPI.content(action.instruction, MODEL)
            fullActionsHistory.push({ ...action, result: response.content })
            await updateMessage(
              tabId,
              `I generated the following content based on the user's request ${response.content}`
            )
            break
          }
          case "scroll": {
            await scroll(tabId, action.direction)
            fullActionsHistory.push({ ...action, result: action.content })
            break
          }
          case "search": {
            await navigate(
              tabId,
              `https://www.google.com/search?q=${action.search_term})`
            )
            await ping(tabId)
            await wait(tabId)
            fullActionsHistory.push(action)
            break
          }
          case "done": {
            console.log("The task has been completed")
            updateMessage(tabId, action.summary)
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
