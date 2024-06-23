import {
  click,
  closeModal,
  getInteractiveElements,
  getTextFromPage,
  initialActionSchema,
  openModal,
  scroll,
  updateMessage,
  type Action
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
import { sleep } from "@/lib/utils"
import type { z } from "zod"

import { type PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const MODEL = "gpt"
const storage = new Storage()

type WebsiteMessageData = {
  objective: string
  objectiveId: string
  type: "write" | "paste"
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const reqBody = req.body as WebsiteMessageData
  const objectiveId = reqBody.objectiveId ?? "1234567"
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
    let nextAction: Action[]
    let isObjectiveComplete: boolean = false

    // Function to store actions
    async function storeActions(actions: Action[]) {
      const storedActions =
        (await storage.get<Action[]>(`actions_${objectiveId}`)) || []
      const updatedActions = [...storedActions, ...actions]
      await storage.set(`actions_${objectiveId}`, updatedActions)
    }

    // Function to get stored actions
    async function getStoredActions(): Promise<Action[]> {
      return (await storage.get<Action[]>(`actions_${objectiveId}`)) || []
    }

    const initialAction = await agentAPI.initialAction(reqBody.objective, MODEL)
    res.send({ success: true })

    // Store the initial action
    await storeActions([initialAction])
    switch (initialAction.operation) {
      case "search": {
        window = await search(initialAction.search_term)
        tabId = window.tabs[0].id
        await ping(tabId)
        await wait(tabId)
        await updateMessage(tabId, [initialAction])
        await openModal(tabId)
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
        await wait(tabId)
        await updateMessage(tabId, [initialAction])
        await openModal(tabId)
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
      console.log(await getStoredActions())
      await closeModal(tabId)
      await sleep(100)
      const screenshot = await takeScreenshot(window.id)
      const { html } = await getInteractiveElements(tabId)
      console.log(screenshot, html)
      await openModal(tabId)
      requestNumber++

      nextAction = await agentAPI.action(
        [screenshot],
        html,
        reqBody.objective,
        MODEL,
        objectiveId
      )

      console.log("Next Action", nextAction)

      // Store the new actions
      await storeActions(nextAction)

      // Update the content script with all actions
      const allActions = await getStoredActions()

      for (const action of nextAction) {
        console.log(action.thought)
        switch (action.operation) {
          case "navigate_to": {
            await navigate(tabId, action.url)
            await ping(tabId)
            await wait(tabId)
            await updateMessage(tabId, allActions)

            break
          }
          case "type": {
            await typeText(tabId, action.text)
            await updateMessage(tabId, allActions)

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
            await updateMessage(tabId, allActions)

            break
          }
          case "click": {
            await click(tabId, `[data-id="${action.data_id}"]`)
            await ping(tabId)
            await updateMessage(tabId, allActions)
            await wait(tabId)

            break
          }
          case "content_writing": {
            const response = await agentAPI.content(action.instruction, MODEL)
            await updateMessage(tabId, allActions)
            break
          }
          case "scroll": {
            await scroll(tabId, action.direction)
            await updateMessage(tabId, allActions)
            break
          }
          case "search": {
            await navigate(
              tabId,
              `https://www.google.com/search?q=${action.search_term})`
            )
            await ping(tabId)
            await updateMessage(tabId, allActions)
            await wait(tabId)
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
