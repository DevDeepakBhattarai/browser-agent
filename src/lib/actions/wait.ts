import { sleep } from "../utils"

export async function wait(tabId) {
  const tab = await chrome.tabs.get(tabId)
  if (tab.status === "complete") {
    await sleep(3000)
  }

  if (tab.status === "loading") {
    await new Promise<void>((resolve) => {
      const listener = async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo
      ) => {
        if (tabId === tab.id && changeInfo.status === "complete") {
          const tab = await chrome.tabs.get(tabId)
          console.log(tab)
          chrome.tabs.onUpdated.removeListener(listener) // Remove listener once page is loaded
          resolve()
        }
      }
      chrome.tabs.onUpdated.addListener(listener)
    })
    await sleep(3000)
  }
}
