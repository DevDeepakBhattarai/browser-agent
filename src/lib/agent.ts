import type { z } from "zod"

import type {
  actionHistorySchema,
  actionSchema,
  initialActionSchema
} from "./actionHelper"
import { addBase64ImageToFormData } from "./utils"

const BASE_URL = process.env.PLASMO_PUBLIC_WEBSITE_URL
type AvailableModels = "gpt" | "claude" | "gemini"

async function initialAction(
  objective: string,
  model: AvailableModels = "gpt"
) {
  const response: z.infer<typeof initialActionSchema> = await fetch(
    BASE_URL + "/api/agent/plan",
    {
      method: "POST",
      body: JSON.stringify({
        objective,
        model
      })
    }
  ).then((res) => res.json())

  console.log(response)
  return response
}

async function action(
  image: string[],
  html: string,
  objective: string,
  model: AvailableModels,
  actions_completed: string,
  summary: string | undefined
) {
  const formData = new FormData()
  // Add all the images to the form Data
  image.forEach((image) => {
    addBase64ImageToFormData(image, formData)
  })

  formData.append("html", html)
  formData.append("model", model)
  formData.append("objective", objective)
  formData.append("actions_completed", actions_completed)
  // Check if the previous summary of the action exists and if it does add it , else not
  if (summary) {
    formData.append("summary", summary)
  }

  const response: {
    action: z.infer<typeof actionSchema>
    summary: string | undefined
  } = await fetch(BASE_URL + "/api/agent/action", {
    method: "POST",
    body: formData
  }).then((res) => res.json())
  return { action: response.action, summary: response.summary }
}

type ContentResponse = { content: string }
async function content(
  instruction: string,
  model: AvailableModels = "gpt"
): Promise<ContentResponse> {
  const response: ContentResponse = await fetch(
    BASE_URL + "/api/agent/content",
    {
      method: "POST",
      body: JSON.stringify({
        prompt: instruction,
        model
      })
    }
  ).then((res) => res.json())

  return response
}

type GatherInformationResponse = {
  page_data: string
  is_data_available: boolean
}
async function gatherInformationFromPage(
  instruction: string,
  page_content: string,
  model: AvailableModels = "gpt"
) {
  const response: GatherInformationResponse = await fetch(
    BASE_URL + "/api/agent/gather-information",
    {
      method: "POST",
      body: JSON.stringify({
        instruction: instruction,
        model: model,
        page_content: page_content
      })
    }
  ).then((res) => res.json())

  return response
}

export const agentAPI = {
  initialAction,
  action,
  content,
  gatherInformationFromPage
}
