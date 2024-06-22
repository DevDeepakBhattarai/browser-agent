import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useChatMessages } from "@/states/message-state"
import React from "react"

export default function ChatList() {
  const { messages } = useChatMessages()
  return (
    <div className="flex-1 p-4 w-full">
      {messages.map((message, index) => (
        <div key={index} className="flex items-start gap-4">
          <Avatar className="border w-10 h-10">
            <AvatarImage alt="Image" src={""} />
            <AvatarFallback className="text-black">AI</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="font-bold">ALLWEONE</div>
            <div className="prose prose-stone">
              <p>{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
