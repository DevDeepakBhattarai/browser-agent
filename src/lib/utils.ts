import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

import type { actionSchema } from "./actionHelper"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function addBase64ImageToFormData(
  base64Image: string,
  formData: FormData
) {
  // Convert the base64 image to a Blob
  const byteCharacters = atob(base64Image.split(",")[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: "image/jpeg" })

  // Append the Blob to FormData
  formData.append("image", blob, "screenshot.jpg")
}

// Define your schemas as before

export function formatActions(
  actions: z.infer<typeof actionSchema>,
  oldActionString: string,
  generated_content?: string
) {
  let result = oldActionString
  for (const action of actions) {
    switch (action.operation) {
      case "navigate_to": {
        result += `- Navigated to ${action.url}\n`
        break
      }
      case "type": {
        result += `- Typed "${action.text}"\n`
        break
      }
      case "click": {
        result += `- Clicked on element with data ID "${action.data_id}"\n`
        break
      }
      case "content_writing": {
        result += `- Performed content writing with instruction: "${action.instruction}"\n`
        if (generated_content)
          result += `- Content that was generated was : ${generated_content}\n`
        break
      }
      case "scroll_down": {
        result += `- Scrolled down\n`
        break
      }
      case "scroll_up": {
        result += `- Scrolled up\n`
        break
      }
      case "search": {
        result += `- Searched for "${action.search_term}"\n`
        break
      }
      case "done": {
        result += `- Completed with summary: "${action.summary}"\n`
        break
      }
      default: {
        // Handle any unexpected operation types
        result += `- There was an error\n`
        break
      }
    }
  }

  return result.trim() // Trim trailing newline if needed
}
