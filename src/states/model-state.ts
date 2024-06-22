import { create } from "zustand"

type ModalState = {
  isModalOpen: boolean
  setIsModalOpen: (update: boolean | ((prev: boolean) => boolean)) => void
}

export const useModal = create<ModalState>((set) => ({
  isModalOpen: false,
  setIsModalOpen: (update) =>
    set((state) => ({
      isModalOpen:
        typeof update === "function" ? update(state.isModalOpen) : update
    }))
}))
