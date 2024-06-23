import { useChatMessages } from "@/states/message-state"
import React, { useEffect, useRef } from "react"
import ScrollToBottom from "react-scroll-to-bottom"

import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import ChatInput from "./ChatInput"
import ChatList from "./ChatList"
import Header from "./Header"

export default function ChatWindow() {
  const ref = useRef<HTMLDivElement>(null)
  const { messages } = useChatMessages()
  useEffect(() => {
    if (ref) ref.current.scrollIntoView({ behavior: "instant" })
  }, [messages])
  return (
    <div className="flex flex-col rounded-lg w-[400px] h-[560px] fixed bottom-4 right-[40px] z-[999999] shadow-md shadow-white border-white border backdrop-blur-lg">
      <Header></Header>
      <Separator></Separator>
      <div className="flex-1 overflow-auto w-full">
        <ChatList></ChatList>
        <div ref={ref}></div>
      </div>

      <div className="sticky bottom-0 py-2 px-2">
        <ChatInput></ChatInput>
      </div>
    </div>
  )
}
