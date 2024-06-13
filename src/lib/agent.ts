import type { z } from "zod"

import type { actionSchema } from "./actionHelper"
import { addBase64ImageToFormData } from "./utils"

const BASE_URL = "http://localhost:3000"
type AvailableModels = "gpt" | "claude" | "gemini"
type Plan = {
  plan: string[]
  action: { goto: string } | { search: string }
}
async function plan(
  prompt: string,
  model: AvailableModels = "gpt"
): Promise<Plan> {
  const response: Plan = await fetch(BASE_URL + "/api/agent/plan", {
    body: JSON.stringify({
      prompt,
      model
    })
  }).then((res) => res.json())

  console.log(response)
  return response
}

async function action(
  image: string[],
  html: string,
  task: string,
  model: AvailableModels,
  step: string,
  completedSteps: string[]
) {
  const formData = new FormData()
  image.forEach((image) => {
    addBase64ImageToFormData(image, formData)
  })
  formData.append("html", html)
  formData.append("model", model)
  formData.append("step", step)
  formData.append("task", task)
  completedSteps.forEach((step) => {
    formData.append("completedSteps", step)
  })

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
    BASE_URL + "api/agent/content",
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

export const agentAPI = {
  plan,
  action,
  content
}
