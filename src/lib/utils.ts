import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
