import { create } from "zustand"

type Message = {
  sender: string
  content: string
}
type MessageState = {
  messages: Message[]
  setMessages: (update: Message[] | ((prev: Message[]) => Message[])) => void
}

export const useChatMessages = create<MessageState>((set) => ({
  messages: [],
  setMessages: (update) =>
    set((state) => ({
      messages: typeof update === "function" ? update(state.messages) : update
    }))
}))
