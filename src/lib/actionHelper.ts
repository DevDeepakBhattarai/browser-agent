import { z } from "zod"

import { sendToContentScript } from "@plasmohq/messaging"

type TypeTextResponse = { success: boolean }
export async function typeText(
  tabId: number,
  selector: string,
  text: string,
  type: "write" | "paste"
): Promise<TypeTextResponse> {
  return await sendToContentScript({
    name: "type",
    tabId,
    body: {
      selector,
      text,
      type,
      name: "type"
    }
  })
}

type NavigateResponse = { success: boolean }
export async function navigate(
  tabId: number,
  url: string
): Promise<NavigateResponse> {
  return await sendToContentScript({
    name: "navigate",
    tabId,
    body: {
      url,
      name: "navigate"
    }
  })
}
type WaitResponse = { success: boolean }
export async function wait(tabId: number): Promise<WaitResponse> {
  return await sendToContentScript({
    name: "wait",
    tabId,
    body: {
      name: "wait"
    }
  })
}

type ScrollResponse = { success: boolean }
export async function scroll(
  tabId: number,
  direction: "up" | "down"
): Promise<ScrollResponse> {
  return await sendToContentScript({
    name: "scroll",
    tabId,
    body: {
      direction,
      name: "scroll"
    }
  })
}

type GetHTMLResponse = { html: string; success: boolean }
export async function getHTML(tabId: number): Promise<GetHTMLResponse> {
  return await sendToContentScript({
    name: "getHTML",
    tabId,
    body: {
      name: "getHTML"
    }
  })
}

type clickResponse = { success: boolean }
export async function click(
  tabId: number,
  selector: string
): Promise<clickResponse> {
  return await sendToContentScript({
    name: "click",
    tabId,
    body: {
      selector,
      name: "click"
    }
  })
}

const navigateSchema = z.object({
  goto: z
    .string()
    .url()
    .optional()
    .describe(
      "URL to navigate to, if provided by the user. Use this format if you think going to a URL is the best option."
    )
})

const contentWritingSchema = z.object({
  content_writing: z
    .object({
      instruction: z
        .string()
        .describe(
          "Instruction for an AI model to write the content on the given topic. Use this format if you think you need to write content."
        ),
      selector: z
        .string()
        .describe(
          "Selector the element in which the written content needs to be paste / inserted"
        )
    })
    .optional()
})
const typeSchema = z.object({
  type: z
    .object({
      content: z.string().describe("What needs to be written"),
      selector: z
        .string()
        .describe(
          "data-interactive ID of the element in which the content needs to be written on"
        )
    })
    .optional()
    .describe(
      "Use this format if you think writing on the webpage is the best action"
    )
})

const clickSchema = z.object({
  click: z
    .string()
    .optional()
    .describe(
      "data-interactive ID of the element to click on. Use this if you think clicking on the element is the best action"
    )
})

const scrollUpSchema = z.object({
  scroll_up: z.literal(true).optional().describe("Use this to scroll up")
})

const scrollDownSchema = z.object({
  scroll_down: z.literal(true).optional().describe("Use this to scroll down")
})

const stepCompletedSchema = z.object({
  completed: z
    .literal(true)
    .optional()
    .describe("Use this when the task has been completed")
})
const actionSchema = z.union([
  navigateSchema,
  contentWritingSchema,
  typeSchema,
  clickSchema,
  scrollUpSchema,
  scrollDownSchema,
  stepCompletedSchema
])

export { actionSchema }
