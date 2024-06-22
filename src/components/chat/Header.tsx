import { useModal } from "@/states/model-state"
import { Brain, X } from "lucide-react"
import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

export default function Header() {
  const { setIsModalOpen } = useModal()

  return (
    <header className="p-4 h-12 w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full grid place-items-center">
          <Brain></Brain>
        </div>
        <h2 className="text-lg font-medium">ALLWEONE</h2>
      </div>

      <div>
        <Button
          onClick={() => setIsModalOpen(false)}
          size="icon"
          className="rounded-full"
          variant="ghost">
          <X></X>
        </Button>
      </div>
    </header>
  )
}
