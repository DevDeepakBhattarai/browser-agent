import { CountButton } from "@/features/count-button"

import "@/style.css"

function IndexPopup() {
  return (
    <div
      onClick={async () => {
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        })
        await chrome.sidePanel.open({ tabId: tab.id })
      }}
      className="flex items-center justify-center h-16 w-40">
      <CountButton />
    </div>
  )
}

export default IndexPopup
