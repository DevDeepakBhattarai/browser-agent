import { CountButton } from "@/features/count-button"
import cssText from "data-text:@/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { useMessage } from "@plasmohq/messaging/hook"

import ChatTrigger from "../components/chat/ChatTrigger"
import ChatWindow from "../components/chat/ChatWindow"
import { useModal } from "../states/model-state"

export const config: PlasmoCSConfig = {
  matches: ["https://www.google.com/*", "http://localhost:3000/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const { data } = useMessage(async (req, res) => {
    const reqData = req.body as { type: string; message: string }
    console.log("This is message from content script")
    console.log(reqData)

    if (reqData.type == "TASK") {
      return res.send({ type: "ACCEPT", message: "Ok I accept you task" })
    }
  })

  const { isModalOpen } = useModal()

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "sendRequest" && message.from === "content") {
        fetch(message.url)
          .then((response) => response.text())
          .then((result) => sendResponse({ result }))
          .catch((error) => sendResponse({ error: error.message }))
        return true // Will respond asynchronously.
      }
    })
  }, [])
  return (
    <div className="z-50 flex fixed bottom-32 right-0">
      <ChatTrigger></ChatTrigger>
      {isModalOpen && <ChatWindow />}
    </div>
  )
}

export default PlasmoOverlay
