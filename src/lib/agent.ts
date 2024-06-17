import type { z } from "zod"

import type { actionSchema, initialActionSchema } from "./actionHelper"
import { addBase64ImageToFormData } from "./utils"

const BASE_URL = "http://localhost:3000"
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
  actions_completed: string
) {
  const formData = new FormData()
  image.forEach((image) => {
    addBase64ImageToFormData(image, formData)
  })
  formData.append("html", html)
  formData.append("model", model)
  formData.append("objective", objective)
  formData.append("actions_completed", actions_completed)

  const response: z.infer<typeof actionSchema> = await fetch(
    BASE_URL + "/api/agent/action",
    {
      method: "POST",
      body: formData
    }
  ).then((res) => res.json())

  return response
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
        model,
        page_content
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
