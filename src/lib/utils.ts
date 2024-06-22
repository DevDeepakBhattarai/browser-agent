import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

import type { actionHistorySchema, actionSchema } from "./actionHelper"

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

export function formatActions(
  fullActionsHistory: z.infer<typeof actionHistorySchema>
) {
  let actionString = ""
  for (const action of fullActionsHistory) {
    actionString += `-|Operation: ${action.operation}\n`

    switch (action.operation) {
      case "navigate_to": {
        actionString += `Result: Navigated to ${action.url}\n`
        break
      }
      case "type": {
        actionString += `Result: Typed "${action.text}"\n`
        break
      }
      case "click": {
        actionString += `Result: Clicked on element with text or aria-label "${action.text}"\n`
        break
      }
      case "gather_information_from_page": {
        actionString += `Result: Initiated Information gathering from page with instruction: ${action.instruction}\n`
        if (action.result === "NO_INFORMATION") {
          actionString += `Result: Could not find any information based on the request\n`
        } else {
          actionString += `Result: Found the following information: ${action.result}\n`
        }
        break
      }
      case "content_writing": {
        actionString += `Result: Performed content writing with instruction: "${action.instruction}"\n`
        if (action.result) {
          actionString += `Result: Content that was generated was: ${action.result}\n`
        }
        break
      }
      case "scroll": {
        actionString += `Result: Scrolled ${action.direction} after seeing the following information on the page: ${action.result}\n`
        break
      }
      case "search": {
        actionString += `Result: Searched for "${action.search_term} on google"\n`
        break
      }
      case "done": {
        actionString += `Result: Completed with summary: "${action.summary}"\n`
        break
      }
      default: {
        // Handle any unexpected operation types
        actionString += `Result: There was an error\n`
        break
      }
    }
  }
  return actionString
}
