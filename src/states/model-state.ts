import { create } from "zustand"

type ModalState = {
  isModalOpen: boolean
  setIsModelOpen: (update: boolean | ((prev: boolean) => boolean)) => void
}

export const useModal = create<ModalState>((set) => ({
  isModalOpen: false,
  setIsModelOpen: (update) =>
    set((state) => ({
      isModalOpen:
        typeof update === "function" ? update(state.isModalOpen) : update
    }))
}))
