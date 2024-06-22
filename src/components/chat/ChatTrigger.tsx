import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card"
import { useModal } from "@/states/model-state"
import Logo from "data-base64:@/assets/logo.svg"
import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import React, { useState } from "react"

export default function ChatTrigger() {
  const { setIsModalOpen } = useModal()
  const [isBeingDragged, setIsBeingDragged] = useState(false)
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          onClick={() =>
            !isBeingDragged ? setIsModalOpen((prev) => !prev) : null
          }
          drag="y"
          onDragStart={() => setIsBeingDragged(true)}
          onDragEnd={() => setIsBeingDragged(false)}
          dragConstraints={{ top: -window.screen.availHeight, bottom: 128 }}
          dragMomentum={false}
          className="">
          <div className="grid place-items-center h-[36px] w-[40px] rounded-l-md text-white bg-black">
            <Brain />
          </div>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent side="left" className="text-xs p-1 w-max">
        An autonomous browser agent
      </HoverCardContent>
    </HoverCard>
  )
}
