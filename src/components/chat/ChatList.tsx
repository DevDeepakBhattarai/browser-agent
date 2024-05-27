import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import React from "react"

const messages = [
  {
    id: 1,
    user: "You",
    avatarFallback: "YO",
    message: "Hey there! How's it going?",
    imgSrc: "/placeholder-user.jpg"
  },
  {
    id: 2,
    user: "ChatGPT",
    avatarFallback: "OA",
    message: "I'm doing great, thanks for asking! How can I help you today?",
    imgSrc: "/placeholder-user.jpg"
  },
  {
    id: 3,
    user: "You",
    avatarFallback: "YO",
    message:
      "I'm working on a new project and I could use your help. Can you give me some advice?",
    imgSrc: "/placeholder-user.jpg"
  },
  {
    id: 4,
    user: "ChatGPT",
    avatarFallback: "OA",
    message:
      "Absolutely, I'd be happy to help. What kind of project are you working on?",
    imgSrc: "/placeholder-user.jpg"
  }
]

export default function ChatList() {
  return (
    <div className="flex-1 overflow-auto p-4 w-full">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-4">
          <Avatar className="border w-10 h-10">
            <AvatarImage alt="Image" src={message.imgSrc} />
            <AvatarFallback className="text-black">
              {message.avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="font-bold">{message.user}</div>
            <div className="prose prose-stone">
              <p>{message.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
