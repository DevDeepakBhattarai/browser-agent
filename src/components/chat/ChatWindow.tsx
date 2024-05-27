import { useModal } from "@/states/model-state"
import { X } from "lucide-react"
import React from "react"

import { Button } from "../ui/button"
import ChatInput from "./ChatInput"
import ChatList from "./ChatList"

export default function ChatWindow() {
  const { setIsModelOpen } = useModal()

  return (
    <div className="max-w-md h-[35rem] fixed bottom-0 right-0 z-[999999] border-white border backdrop-blur-lg ">
      <div className="absolute top-0 right-0">
        <Button
          onClick={() => setIsModelOpen(false)}
          size="icon"
          className="rounded-full"
          variant="ghost">
          <X></X>
        </Button>
      </div>

      <div className="flex h-full w-full flex-col">
        <ChatList></ChatList>
        <div className="sticky bottom-0 pb-4 px-2">
          <ChatInput></ChatInput>
        </div>
      </div>
    </div>
  )
}
