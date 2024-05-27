import { create } from "zustand"

export type PreviewImage = { id: string; url: string }

type InputState = {
  prompt: string
  setPrompt: (update: string | ((prev: string) => string)) => void
  previewImages: PreviewImage[]
  setPreviewImages: (
    update: PreviewImage[] | ((prev: PreviewImage[]) => PreviewImage[])
  ) => void
}

export const useInput = create<InputState>((set) => ({
  prompt: "",
  setPrompt: (update) =>
    set((state) => ({
      prompt: typeof update === "function" ? update(state.prompt) : update
    })),
  previewImages: [],
  setPreviewImages: (update) =>
    set((state) => ({
      previewImages:
        typeof update === "function" ? update(state.previewImages) : update
    }))
}))
