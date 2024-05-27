import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card"
import { useModal } from "@/states/model-state"
import { motion } from "framer-motion"
import React, { useState } from "react"

export default function ChatTrigger() {
  const { setIsModelOpen } = useModal()
  const [isBeingDragged, setIsBeingDragged] = useState(false)
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          onClick={() =>
            !isBeingDragged ? setIsModelOpen((prev) => !prev) : null
          }
          drag="y"
          onDragStart={() => setIsBeingDragged(true)}
          onDragEnd={() => setIsBeingDragged(false)}
          dragConstraints={{ top: -window.screen.availHeight, bottom: 128 }}
          dragMomentum={false}
          className="">
          <div className="h-9 w-10 rounded-l-sm bg-red-500 "></div>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent side="left" className="text-xs p-1 w-max">
        An autonomous browser agent
      </HoverCardContent>
    </HoverCard>
  )
}
