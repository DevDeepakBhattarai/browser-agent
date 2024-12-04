import type { PlasmoCSConfig } from "plasmo"

import { relayMessage } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: [
    "http://localhost:3000/*",
    "https://allweone.com/*",
    "https://www.allweone.com/*"
  ]
}

relayMessage({
  name: "task"
})
