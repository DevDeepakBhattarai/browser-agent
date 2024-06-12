import { CountButton } from "@/features/count-button"

import "@/style.css"

import React, { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"

const Popup = () => {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const handleRequest = (from) => {
    chrome.runtime.sendMessage(
      { action: "sendRequest", url, from },
      (response) => {
        if (response.error) {
          setError(response.error)
          setResult("")
        } else {
          setResult(response.result)
          setError("")
        }
      }
    )
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        className="w-full"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <div className="flex gap-4">
        <Button
          onClick={async () => {
            const res = await sendToBackground({
              name: "test",
              body: {}
            })
            console.log(res)
          }}>
          Send from Background
        </Button>
      </div>

      {result && <div>Result: {result}</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
    </div>
  )
}

export default Popup
