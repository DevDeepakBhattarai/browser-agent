import { useModal } from "@/states/model-state"
import { X } from "lucide-react"
import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

export default function Header() {
  const { setIsModelOpen } = useModal()

  return (
    <header className="p-4 h-12 w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage alt="Agent Avatar" src="/placeholder-user.jpg" />
          <AvatarFallback>ALLWEONE</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium">ALLWEONE</h2>
      </div>

      <div>
        <Button
          onClick={() => setIsModelOpen(false)}
          size="icon"
          className="rounded-full"
          variant="ghost">
          <X></X>
        </Button>
        <Button
          onClick={() => {
            var event = new KeyboardEvent("keydown", {
              key: "f",
              shiftKey: false
            })

            // Dispatch the event to the document
            document.dispatchEvent(event)
          }}>
          Hello
        </Button>
      </div>
    </header>
  )
}
