import type { Action, actionSchema } from "@/lib/actionHelper"
import { sleep } from "@/lib/utils"
import { useChatMessages } from "@/states/message-state"
import cssText from "data-text:@/style.css"
import type { PlasmoCSConfig } from "plasmo"
import type { z } from "zod"

import { useMessage } from "@plasmohq/messaging/hook"

import ChatTrigger from "../components/chat/ChatTrigger"
import ChatWindow from "../components/chat/ChatWindow"
import { useModal } from "../states/model-state"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

type MessageType = {
  actions: Action[]
  type: "message"
}

type PopupType = {
  action: "close" | "open"
  type: "popup"
}

type RequestData = MessageType | PopupType

const PlasmoOverlay = () => {
  const { isModalOpen, setIsModalOpen } = useModal()
  const { setMessages } = useChatMessages()
  const response = useMessage((req, res) => {
    const reqBody = req.body as RequestData
    switch (reqBody.type) {
      case "message":
        const messages = reqBody.actions.map((action) => {
          return { content: action.thought, sender: "AI" }
        })
        setMessages(messages)
        res.send({ success: true })
        break
      case "popup":
        if (reqBody.action === "open") {
          setIsModalOpen(true)
          res.send({ success: true })
        }
        if (reqBody.action === "close") {
          setIsModalOpen(false)
          res.send({ success: true })
        }
    }
  })
  return (
    <div className="z-50 flex fixed bottom-32 right-0 !text-[16px]">
      <ChatTrigger></ChatTrigger>
      {isModalOpen && <ChatWindow />}
    </div>
  )
}

export default PlasmoOverlay
