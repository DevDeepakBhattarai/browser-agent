import { CountButton } from "@/features/count-button"
import cssText from "data-text:@/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { useMessage } from "@plasmohq/messaging/hook"

import ChatTrigger from "../components/chat/ChatTrigger"
import ChatWindow from "../components/chat/ChatWindow"
import { useModal } from "../states/model-state"

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.google.com/*",
    "http://localhost:3000/*",
    "https://x.com/*"
  ]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const { isModalOpen } = useModal()

  return (
    <div className="z-50 flex fixed bottom-32 right-0">
      <ChatTrigger></ChatTrigger>

      {isModalOpen && <ChatWindow />}
    </div>
  )
}

export default PlasmoOverlay
