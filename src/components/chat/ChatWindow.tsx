import { MicIcon, PaperclipIcon, SendIcon } from "lucide-react"
import React from "react"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import ChatInput from "./ChatInput"
import ChatList from "./ChatList"

export default function ChatWindow() {
  return (
    <div className="w-96 h-[30rem] fixed bottom-0 right-0 border-white border bg-slate-500">
      <div className="flex h-full w-full flex-col">
        <ChatList></ChatList>
        <div className="sticky bottom-0 px-4 py-3 flex items-center justify-between">
          <ChatInput></ChatInput>
        </div>
      </div>
    </div>
  )
}
