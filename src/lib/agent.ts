import type { z } from "zod"

import type {
  Action,
  actionHistorySchema,
  actionSchema,
  initialActionSchema
} from "./actionHelper"
import { addBase64ImageToFormData } from "./utils"

const BASE_URL = process.env.PLASMO_PUBLIC_WEBSITE_URL
type AvailableModels = "gpt" | "claude" | "gemini"

async function initialAction(
  objective: string,
  objectiveId: string,
  model: AvailableModels = "gpt"
) {
  const response: z.infer<typeof initialActionSchema> = await fetch(
    BASE_URL + "/api/agent/plan",
    {
      method: "POST",
      body: JSON.stringify({
        objective,
        objectiveId,
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
  objectiveId: string
) {
  const formData = new FormData()
  // Add all the images to the form Data
  image.forEach((image) => {
    addBase64ImageToFormData(image, formData)
  })

  formData.append("html", html)
  formData.append("model", model)
  formData.append("objective", objective)
  formData.append("objectiveId", objectiveId)

  const response = await fetch(BASE_URL + "/api/agent/action", {
    method: "POST",
    body: formData
  }).then((res) => res.json())
  return response as Action[]
}

type ContentResponse = { content: string }
async function content(
  instruction: string,
  model: AvailableModels = "gpt",
  objectiveId: string
): Promise<ContentResponse> {
  const response: ContentResponse = await fetch(
    BASE_URL + "/api/agent/content",
    {
      method: "POST",
      body: JSON.stringify({
        prompt: instruction,
        model,
        objectiveId
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
  model: AvailableModels = "gpt",
  objectiveId: string
) {
  const response: GatherInformationResponse = await fetch(
    BASE_URL + "/api/agent/gather-information",
    {
      method: "POST",
      body: JSON.stringify({
        instruction: instruction,
        model: model,
        page_content: page_content,
        objectiveId
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
