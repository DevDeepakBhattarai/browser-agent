import { z } from "zod"

import { sendToContentScript } from "@plasmohq/messaging"

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
// type WaitResponse = { success: boolean }
// export async function wait(tabId: number): Promise<WaitResponse> {
//   return await sendToContentScript({
//     name: "wait",
//     tabId,
//     body: {
//       name: "wait"
//     }
//   })
// }

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

type GetInteractiveElementsResponse = { html: string; success: boolean }
export async function getInteractiveElements(
  tabId: number
): Promise<GetInteractiveElementsResponse> {
  return await sendToContentScript({
    name: "getInteractiveElements",
    tabId,
    body: {
      name: "getInteractiveElements"
    }
  })
}
type GetTextFromPage = { page_content: string; success: boolean }
export async function getTextFromPage(tabId: number): Promise<GetTextFromPage> {
  return await sendToContentScript({
    name: "getTextFromPage",
    tabId,
    body: {
      name: "getTextFromPage"
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

export async function openModal(tabId: number) {
  return sendToContentScript({
    tabId: tabId,
    name: "index",
    body: {
      type: "popup",
      action: "open"
    }
  })
}
export async function closeModal(tabId: number) {
  return sendToContentScript({
    tabId: tabId,
    name: "index",
    body: {
      type: "popup",
      action: "close"
    }
  })
}
export async function updateMessage(tabId: number, actions: Action[]) {
  return sendToContentScript({
    tabId: tabId,
    name: "index",
    body: {
      type: "message",
      actions: actions
    }
  })
}

const navigateToSchema = z.object({
  thought: z.string(),
  operation: z.literal("navigate_to"),
  url: z.string().url()
})

const searchSchema = z.object({
  thought: z.string(),
  operation: z.literal("search"),
  search_term: z.string()
})

const contentWritingSchema = z.object({
  thought: z.string(),
  operation: z.literal("content_writing"),
  instruction: z.string()
})

const typeSchema = z.object({
  thought: z.string(),
  operation: z.literal("type"),
  text: z.string()
})

const clickSchema = z.object({
  thought: z.string(),
  operation: z.literal("click"),
  data_id: z.string(),
  text: z.string()
})

const scrollSchema = z.object({
  thought: z.string(),
  operation: z.literal("scroll"),
  content: z.string(),
  direction: z.union([z.literal("up"), z.literal("down")])
})

const doneSchema = z.object({
  thought: z.string(),
  operation: z.literal("done"),
  summary: z.string()
})
const gatherInfoSchema = z.object({
  thought: z.string(),
  operation: z.literal("gather_information_from_page"),
  instruction: z.string()
})

const actionSchema = z.union([
  navigateToSchema,
  searchSchema,
  contentWritingSchema,
  typeSchema,
  clickSchema,
  scrollSchema,
  doneSchema,
  gatherInfoSchema
])

const resultSchema = z.object({
  result: z.string().optional()
})

export const actionHistorySchema = z.union([
  navigateToSchema.merge(resultSchema),
  searchSchema.merge(resultSchema),
  contentWritingSchema.merge(resultSchema),
  typeSchema.merge(resultSchema),
  clickSchema.merge(resultSchema),
  scrollSchema.merge(resultSchema),
  doneSchema.merge(resultSchema),
  gatherInfoSchema.merge(resultSchema)
])

export type Action = z.infer<typeof actionSchema>
export const initialActionSchema = z.union([searchSchema, navigateToSchema])
export { actionSchema }
