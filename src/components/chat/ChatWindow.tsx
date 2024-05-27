import React from "react"

import { Separator } from "../ui/separator"
import ChatInput from "./ChatInput"
import ChatList from "./ChatList"
import Header from "./Header"

export default function ChatWindow() {
  return (
    <div className="max-w-md h-[35rem] fixed bottom-0 right-0 z-[999999] border-white border backdrop-blur-lg">
      <Header></Header>
      <Separator></Separator>
      <div className="flex h-full w-full flex-col">
        <ChatList></ChatList>
        <div className="sticky bottom-0 pb-4 px-2">
          <ChatInput></ChatInput>
        </div>
      </div>
    </div>
  )
}
