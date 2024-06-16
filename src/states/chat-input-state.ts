import { create } from "zustand"

export type PreviewImage = { id: string; url: string }

type InputState = {
  objective: string
  setObjective: (update: string | ((prev: string) => string)) => void
  previewImages: PreviewImage[]
  setPreviewImages: (
    update: PreviewImage[] | ((prev: PreviewImage[]) => PreviewImage[])
  ) => void
}

export const useInput = create<InputState>((set) => ({
  objective: "",
  setObjective: (update) =>
    set((state) => ({
      objective: typeof update === "function" ? update(state.objective) : update
    })),
  previewImages: [],
  setPreviewImages: (update) =>
    set((state) => ({
      previewImages:
        typeof update === "function" ? update(state.previewImages) : update
    }))
}))
